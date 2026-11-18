#!/usr/bin/env node

/**
 * WebGPU Compute Studio v0.1.0
 * Browser-based WebGPU compute shader development environment
 */

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const program = new Command();

program
  .name('wgpu-studio')
  .description('WebGPU compute shader development studio')
  .version('0.1.0')
  .argument('[command]', 'Command to run (init, dev, build, test)', 'dev')
  .option('-p, --port <port>', 'Development server port', '3000')
  .option('--output <dir>', 'Build output directory', 'dist')
  .action((command, options) => {
    console.log('🎮 WebGPU Compute Studio v0.1.0\n');
    
    if (command === 'init') {
      console.log('🚀 Initializing WebGPU project...');
      initProject('.');
    } else if (command === 'dev') {
      console.log(`🔧 Starting development server on port ${options.port}...`);
      startDevServer(options.port);
    } else if (command === 'build') {
      console.log('📦 Building project...');
      buildProject(options.output);
    } else if (command === 'test') {
      console.log('🧪 Testing WebGPU support...');
      testWebGPU();
    } else {
      console.log(`❓ Unknown command: ${command}`);
      program.help();
    }
  });

program.parse();

// ============ Helper Functions ============

function initProject(dir) {
  const projectDir = dir === '.' ? './wgpu-project' : dir;
  
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
    fs.mkdirSync(`${projectDir}/src`, { recursive: true });
    fs.mkdirSync(`${projectDir}/public`, { recursive: true });
    fs.mkdirSync(`${projectDir}/shaders`, { recursive: true });
  }
  
  // Create package.json
  const packageJson = {
    name: 'wgpu-project',
    version: '0.1.0',
    description: 'WebGPU Compute Studio Project',
    type: 'module',
    scripts: {
      dev: 'node server.js',
      build: 'echo "Build complete"',
      test: 'node server.js test'
    },
    dependencies: {
      'webgpu-compute-studio': '^0.1.0'
    }
  };
  
  fs.writeFileSync(`${projectDir}/package.json`, JSON.stringify(packageJson, null, 2));
  
  // Create main shader
  const shader = `
// Simple compute shader example

@group(0) @binding(0) var<storage, read_write> output: array<f32>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let index = gid.x;
  output[index] = f32(index) * 0.5;
}
`;
  
  fs.writeFileSync(`${projectDir}/shaders/compute.wgsl`, shader.trim());
  
  // Create index.html
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WebGPU Compute Studio</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; }
    #canvas { width: 100%; height: 400px; border: 1px solid #ccc; }
  </style>
</head>
<body>
  <h1>WebGPU Compute Shader</h1>
  <canvas id="canvas"></canvas>
  <script type="module" src="src/main.js"></script>
</body>
</html>`;
  
  fs.writeFileSync(`${projectDir}/public/index.html`, html);
  
  // Create main.js
  const mainJs = `import { createComputePipeline } from 'webgpu-compute-studio';

async function main() {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('webgpu');
  
  // Request GPU adapter
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    console.error('WebGPU not supported');
    return;
  }
  
  const device = await adapter.requestDevice();
  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({ device, format, alphaMode: 'opaque' });
  
  // Load and compile shader
  const shaderModule = device.createShaderModule({
    code: \`\${await fetch('./shaders/compute.wgsl').then(r => r.text())}\`
  });
  
  // Create compute pipeline
  const pipeline = device.createComputePipeline({
    layout: 'auto',
    compute: { module: shaderModule, entryPoint: 'main' }
  });
  
  console.log('✅ WebGPU pipeline created successfully');
}

main().catch(console.error);
`;
  
  fs.writeFileSync(`${projectDir}/src/main.js`, mainJs);
  
  console.log(`✅ Project created at ${projectDir}`);
  console.log('   Run "npx wgpu-studio dev" to start development');
}

function startDevServer(port) {
  console.log('Starting development server...');
  console.log(`Server running at http://localhost:${port}`);
  console.log('Press Ctrl+C to stop\n');
  
  // Simple HTTP server
  const http = require('http');
  const fs = require('fs');
  const path = require('path');
  
  const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') filePath = './index.html';
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.wasm': 'application/wasm',
      '.wgsl': 'text/plain',
      '.json': 'application/json'
    };
    
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code === 'ENOENT') {
          res.writeHead(404);
          res.end('404 Not Found');
        } else {
          res.writeHead(500);
          res.end('Server Error: ' + error.code);
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });
  
  server.listen(port, () => {
    console.log(`✅ Server started on port ${port}`);
    console.log('   Open browser to http://localhost:' + port);
  });
}

function buildProject(outputDir) {
  console.log('Building project...');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Create bundled output
  const bundle = `// WebGPU Compute Studio Bundle v0.1.0
// Generated bundle

export const WEBGPU_VERSION = '0.1.0';
export const SUPPORTED_BROWSERS = ['Chrome 113+', 'Edge 113+', 'Firefox 124+', 'Safari 16.4+'];

export function createComputePipeline(device, shaderCode, entryPoint = 'main') {
  const shaderModule = device.createShaderModule({ code: shaderCode });
  return device.createComputePipeline({
    layout: 'auto',
    compute: { module: shaderModule, entryPoint }
  });
}

export async function dispatchCompute(commandEncoder, pipeline, bindGroup, workgroupCount, workgroupSize = 64) {
  const pass = commandEncoder.beginComputePass();
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.dispatchWorkgroups(workgroupCount);
  pass.end();
  return workgroupCount * workgroupSize;
}
`;
  
  fs.writeFileSync(`${outputDir}/webgpu-studio.js`, bundle);
  
  console.log(`✅ Build complete`);
  console.log(`   Output: ${outputDir}/webgpu-studio.js`);
}

function testWebGPU() {
  console.log('Testing WebGPU support...\n');
  
  const results = {
    'navigator.gpu': typeof navigator !== 'undefined' && 'gpu' in navigator,
    'requestAdapter': false,
    'requestDevice': false
  };
  
  console.log('Browser Tests:');
  console.log('| Feature | Supported |');
  console.log('|---------|-----------|');
  console.log(`| navigator.gpu | ${results['navigator.gpu'] ? '✅' : '❌'} |`);
  
  if (results['navigator.gpu']) {
    console.log('\nAttempting to get adapter (this requires user interaction in browser)...');
    console.log('Please run this in a browser environment for full testing.');
  } else {
    console.log('\n❌ WebGPU not supported in this environment.');
    console.log('   Please use a browser with WebGPU support (Chrome 113+, Edge 113+).');
  }
}