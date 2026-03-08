const mongoose = require('mongoose');
require('dotenv').config();

const Project = require('../models/Project');

const sampleProjects = [
  {
    title: 'NeuralChat AI',
    description:
      'A real-time AI chat platform powered by GPT-4 with streaming responses, conversation history, and custom personas. Built with a microservices architecture for scalability.',
    techStack: ['React', 'Node.js', 'Socket.io', 'OpenAI', 'Redis', 'PostgreSQL'],
    githubLink: 'https://github.com/example/neuralchat',
    liveDemo: 'https://neuralchat.demo.com',
    demoVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
    position: { x: -8, y: 0, z: -5 },
  },
  {
    title: 'CryptoVault',
    description:
      'A decentralized crypto portfolio tracker with live price feeds, P&L charts, and wallet integration via MetaMask. Supports 500+ coins across multiple blockchains.',
    techStack: ['Next.js', 'Web3.js', 'Solidity', 'MongoDB', 'Chart.js', 'Tailwind CSS'],
    githubLink: 'https://github.com/example/cryptovault',
    liveDemo: 'https://cryptovault.demo.com',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
    position: { x: 4, y: 0, z: -8 },
  },
  {
    title: 'CloudForge DevOps',
    description:
      'An automated CI/CD pipeline dashboard that integrates with GitHub Actions, Docker, and Kubernetes. Provides real-time deployment monitoring and rollback capabilities.',
    techStack: ['React', 'Python', 'FastAPI', 'Docker', 'Kubernetes', 'AWS'],
    githubLink: 'https://github.com/example/cloudforge',
    liveDemo: 'https://cloudforge.demo.com',
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80',
    position: { x: 10, y: 0, z: 2 },
  },
  {
    title: 'PixelStudio 3D',
    description:
      'An in-browser 3D model editor with procedural generation tools, texture painting, and WebGL-based rendering. Supports GLTF/OBJ export and real-time collaboration.',
    techStack: ['Three.js', 'React', 'WebGL', 'WebSockets', 'Node.js', 'MongoDB'],
    githubLink: 'https://github.com/example/pixelstudio',
    liveDemo: 'https://pixelstudio.demo.com',
    demoVideo: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    position: { x: -6, y: 0, z: 6 },
  },
  {
    title: 'EcoTrack Platform',
    description:
      'An IoT-connected platform that monitors carbon emissions across supply chains using sensor data. Features ML-based anomaly detection and compliance reporting dashboards.',
    techStack: ['Vue.js', 'Python', 'TensorFlow', 'InfluxDB', 'MQTT', 'GraphQL'],
    githubLink: 'https://github.com/example/ecotrack',
    liveDemo: 'https://ecotrack.demo.com',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    position: { x: 0, y: 0, z: 10 },
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Project.deleteMany({});
    console.log('🗑️  Cleared existing projects');

    const inserted = await Project.insertMany(sampleProjects);
    console.log(`🌱 Seeded ${inserted.length} projects successfully:`);
    inserted.forEach((p) => console.log(`   • ${p.title} @ (${p.position.x}, ${p.position.y}, ${p.position.z})`));

    await mongoose.disconnect();
    console.log('✅ Done! MongoDB disconnected.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
