// Plyr Video Player Implementation
// Replace the complex VideoArchitecture with this simple code

// 1. Initialize Plyr Video Player (YouTube-Quality Unified Controls)
const videoElement = document.getElementById('player');

if (videoElement) {
  console.log('✅ Plyr video player found, initializing unified controls...');
  
  // Set dynamic video source based on user data
  const userData = { challenge: window.userChallenge || 'missed-opportunities' };
  const videoMapping = {
    'slow-processes': 'videos/strategy-blueprint.mp4',
    'missed-opportunities': 'videos/lead-saving-blueprint.mp4', 
    'team-scaling': 'videos/team-automation-blueprint.mp4',
    'data-chaos': 'videos/data-organization-blueprint.mp4'
  };
  
  const videoPath = videoMapping[userData.challenge] || 'videos/lead-saving-blueprint.mp4';
  const finalPath = videoPath + '#t=0.001'; // iOS first frame fix
  
  // Update video source
  const source = videoElement.querySelector('source');
  if (source) {
    source.src = finalPath;
    videoElement.load(); // Reload with new source
  }
  
  // Initialize Plyr with YouTube-quality controls
  const player = new Plyr('#player', {
    controls: [
      'play-large',      // Large play button in center
      'play',            // Play/pause button
      'progress',        // Progress bar
      'current-time',    // Current time
      'duration',        // Duration
      'mute',            // Mute button
      'volume',          // Volume slider
      'settings',        // Quality settings (if available)
      'fullscreen'       // Fullscreen button
    ],
    settings: ['quality', 'speed'],
    autoplay: false,
    muted: true,      // Start muted for autoplay compliance
    volume: 0.8,      // Default volume when unmuted
    hideControls: false,
    resetOnEnd: true,
    keyboard: { focused: true, global: false },
    tooltips: { controls: true, seek: true },
    storage: { enabled: true, key: 'plyr' }
  });
  
  // Professional event handling
  player.on('ready', () => {
    console.log('🎬 Plyr player ready with unified controls');
    console.log('📱 Video source set:', finalPath);
  });
  
  player.on('play', () => {
    console.log('▶️ Video playing');
  });
  
  player.on('pause', () => {
    console.log('⏸️ Video paused');
  });
  
  player.on('ended', () => {
    console.log('🏁 Video ended');
  });
  
  player.on('volumechange', () => {
    console.log('🔊 Volume changed:', player.volume);
  });
  
  // Store player globally for debugging
  window.videoPlayer = player;
  
  console.log('✅ Plyr unified video player initialized successfully');
  
} else {
  console.log('⚠️ Video player element not found');
}