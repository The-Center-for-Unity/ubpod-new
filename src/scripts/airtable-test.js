// Mock project data for testing
const mockProjects = [
  {
    name: "Project Alpha",
    permissionGranted: true,
    affinities: {
      discovery: 0.8,
      connection: 0.3,
      wisdom: 0.4
    },
    focus: {
      discovery: "high",
      connection: "low",
      wisdom: "medium"
    }
  },
  {
    name: "Project Beta",
    permissionGranted: true,
    affinities: {
      discovery: 0.4,
      connection: 0.7,
      wisdom: 0.5
    },
    focus: {
      discovery: "medium",
      connection: "high",
      wisdom: "medium"
    }
  },
  {
    name: "Project Gamma",
    permissionGranted: true,
    affinities: {
      discovery: 0.3,
      connection: 0.4,
      wisdom: 0.8
    },
    focus: {
      discovery: "low",
      connection: "medium",
      wisdom: "high"
    }
  },
  {
    name: "Project Delta",
    permissionGranted: false, // This one should be filtered out
    affinities: {
      discovery: 0.5,
      connection: 0.5,
      wisdom: 0.5
    },
    focus: {
      discovery: "medium",
      connection: "medium",
      wisdom: "medium"
    }
  }
];

// Mock getProjects function that returns the test data
async function getProjects() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockProjects;
}

export { getProjects }; 