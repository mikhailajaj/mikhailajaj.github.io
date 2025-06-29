const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const yaml = require('js-yaml');

// Get absolute paths
const PROJECT_ROOT = path.resolve(__dirname, '..');
const BMAD_CORE_DIR = path.join(PROJECT_ROOT, '.ai', '.bmad-core');
const ROVODEV_DIR = path.join(PROJECT_ROOT, '.rovodev');
const WORKFLOWS_DIR = path.join(ROVODEV_DIR, 'workflows');
const INSTRUCTIONS_FILE = path.join(ROVODEV_DIR, 'instructions.yml');

// Ensure directories exist
[WORKFLOWS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Convert YAML workflow to Markdown
function convertToMarkdown(yamlContent) {
  try {
    const workflow = yaml.load(yamlContent);
    if (!workflow.workflow) return null;

    const wf = workflow.workflow;
    let mdContent = `# ${wf.name}\n\n`;
    mdContent += `**ID**: ${wf.id}\n\n`;
    mdContent += `**Description**: ${wf.description}\n\n`;
    
    mdContent += `## Project Types\n`;
    wf.project_types.forEach(type => {
      mdContent += `- ${type}\n`;
    });
    
    mdContent += `\n## Workflow Sequence\n`;
    wf.sequence.forEach(step => {
      mdContent += `\n### Step: ${step.agent}\n`;
      mdContent += `- **Action**: ${step.creates || step.updates || step.action || 'N/A'}\n`;
      if (step.requires) mdContent += `- **Requires**: ${step.requires}\n`;
      if (step.optional_steps) mdContent += `- **Optional Steps**: ${step.optional_steps.join(', ')}\n`;
      if (step.notes) mdContent += `- **Notes**: ${step.notes}\n`;
    });
    
    if (wf.flow_diagram) {
      mdContent += `\n## Flow Diagram\n\n\`\`\`mermaid\n${wf.flow_diagram}\n\`\`\`\n`;
    }
    
    if (wf.decision_guidance?.when_to_use) {
      mdContent += `\n## When to Use This Workflow\n`;
      wf.decision_guidance.when_to_use.forEach(item => {
        mdContent += `- ${item}\n`;
      });
    }
    
    if (wf.handoff_prompts) {
      mdContent += `\n## Handoff Prompts\n`;
      Object.entries(wf.handoff_prompts).forEach(([key, prompt]) => {
        mdContent += `\n### ${key}\n${prompt}\n`;
      });
    }
    
    return {
      id: wf.id,
      name: wf.name,
      content: mdContent
    };
  } catch (error) {
    console.error(`Error converting YAML to Markdown:`, error);
    return null;
  }
}

// Update instructions.yml
function updateInstructions(workflow) {
  try {
    let instructions = { instructions: [] };
    
    if (fs.existsSync(INSTRUCTIONS_FILE)) {
      try {
        instructions = yaml.load(fs.readFileSync(INSTRUCTIONS_FILE, 'utf8'));
      } catch (error) {
        console.error(`Error reading instructions file:`, error);
      }
    }
    
    // Remove existing entry if it exists
    instructions.instructions = instructions.instructions.filter(
      inst => inst.name !== workflow.name
    );
    
    // Add new entry
    instructions.instructions.push({
      name: workflow.name,
      description: `Workflow: ${workflow.name}`,
      content_file: `workflows/${workflow.id}.md`
    });
    
    fs.writeFileSync(INSTRUCTIONS_FILE, yaml.dump(instructions));
    console.log(`Updated instructions file with workflow: ${workflow.name}`);
  } catch (error) {
    console.error(`Error updating instructions file:`, error);
  }
}

// Process a single file
function processFile(filePath) {
  try {
    const yamlContent = fs.readFileSync(filePath, 'utf8');
    const workflow = convertToMarkdown(yamlContent);
    
    if (workflow) {
      const outputPath = path.join(WORKFLOWS_DIR, `${workflow.id}.md`);
      fs.writeFileSync(outputPath, workflow.content);
      updateInstructions(workflow);
      console.log(`Processed: ${path.basename(filePath)} → ${workflow.id}.md`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Process all existing files
function processExistingFiles() {
  try {
    console.log('Processing existing files...');
    
    const workflowFiles = fs.readdirSync(path.join(BMAD_CORE_DIR, 'workflows'))
      .filter(file => file.endsWith('.yml'))
      .map(file => path.join(BMAD_CORE_DIR, 'workflows', file));
    
    const teamFiles = fs.readdirSync(path.join(BMAD_CORE_DIR, 'agent-teams'))
      .filter(file => file.endsWith('.yml'))
      .map(file => path.join(BMAD_CORE_DIR, 'agent-teams', file));
    
    const allFiles = [...workflowFiles, ...teamFiles];
    
    allFiles.forEach(file => {
      if (fs.existsSync(file)) {
        processFile(file);
      }
    });
    
    console.log(`Processed ${allFiles.length} files`);
  } catch (error) {
    console.error('Error processing existing files:', error);
  }
}

// Watch for changes in BMAD workflow files
function setupWatcher() {
  const watcher = chokidar.watch(
    [
      path.join(BMAD_CORE_DIR, 'workflows', '*.yml'),
      path.join(BMAD_CORE_DIR, 'agent-teams', '*.yml')
    ], 
    {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true
    }
  );

  watcher
    .on('add', processFile)
    .on('change', processFile)
    .on('unlink', filePath => {
      console.log(`File removed: ${filePath}`);
      // Implement removal logic if needed
    });

  console.log('Watching for changes in BMAD workflow files...');
  return watcher;
}

// Main execution
try {
  processExistingFiles();
  setupWatcher();
} catch (error) {
  console.error('Initialization error:', error);
}
