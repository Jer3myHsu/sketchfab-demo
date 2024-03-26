// Helper Functions
const origin = [
  0.00275294969145642,
  0.029803887945795617,
  0.3933641541124556
];

function convertColorFormat(color) {
  switch(color) {
    case 'red':
      return [0.8, 0, 0];
    case 'blue':
      return [
        0.018691829541028014,
        0.04875768288265732,
        0.8741016688625401
      ];
    case 'gold':
      return [
        0.6592412686351545,
        0.3769049626985659,
        0.08564050019250428
      ];
    case 'black':
      return [0.01, 0.01, 0.01];
    case 'gray':
      return [0.45, 0.45, 0.45];
    case 'white':
      return [1, 1, 1];
    case 'tan':
      return [0.4, 0.3, 0.2];
    case 'purple':
      return [0.15, 0.05, 0.35];
  }
  return [0, 0, 0];
}

function getMaterialNameByType(type) {
  switch(type) {
    case 'exterior':
      return ['Paint', 'Paint with Text', 'Engine Interior'];
    case 'interior':
      return ['Plastic Interior A', 'Plastic Interior B'];
    case 'rims':
      return ['Rims'];
  }
  return [];
}

// Helper Functions End





function setMaterialColor(api, materialNames, color) {
  api.getMaterialList(function(err, materials) {
    if (err) {
      return;
    }
    for (let name of materialNames) {
      const paintMaterial = materials.find(m => m.name === name);
      paintMaterial.channels.AlbedoPBR.color = color;
      
      api.setMaterial(paintMaterial, function() {
        console.log('Material updated:', name, color);
      });
    }
  });
}



function addButtonActions(api) {
  // All buttons
  // Changes color of materials based on name
  for (let button of document.querySelectorAll('.button-grid button')) {
    button.addEventListener('click', function() {
      const materialNames = getMaterialNameByType(button.className.split('-')[0]);
      const color = convertColorFormat(button.style.backgroundColor);
      setMaterialColor(api, materialNames, color);
    });
  }

  // Exterior color buttons
  // Rotate camera and reset animation
  for (let button of document.querySelectorAll('.exterior-color-button')) {
    button.addEventListener('click', function() {
      const position = [
        -4.835388471278557,
        -4.665739816952249,
        1.2369509990018788
      ];
      api.setCameraLookAt(position, origin, 2);
      api.seekTo(0);
    });
  }

  // Interior color buttons
  // Rotate camera and play animation partially
  for (let button of document.querySelectorAll('.interior-color-button')) {
    button.addEventListener('click', function() {
      const position = [
        1.7174953620866955,
        3.162069240521061,
        1.4101861676285958
      ];
      api.setCameraLookAt(position, origin, 2);
      api.getCurrentTime(function(err, time) {
        if (time > 0.01) {// Handle multi-button clicks
          return;
        }
        api.seekTo(0, function(err) {
          api.play(function(err) {
            setTimeout(function() {
              api.pause();
            }, 1000);
          });
        });
      });
    });
  }

  // Rims color buttons
  // Rotate camera and reset animation
  for (let button of document.querySelectorAll('.rims-color-button')) {
    button.addEventListener('click', function() {
      const position = [
        -0.2894278656453057,
        -6.752171350242997,
        0.6880234463925332
      ];
      api.setCameraLookAt(position, origin, 2);
      api.seekTo(0);
    });
  }
}



function setupViewer(api) {
  api.setBackground({color: [0.95, 0.95, 0.95]});

  api.getPostProcessing(function(settings) {
    settings.vignetteEnable = false;
    api.setPostProcessing(settings);
  });

  api.getAnimations(function(err, animations) {
    if (!err) {
      const leftDoorAnimationUID = animations[1][0];
      api.setCurrentAnimationByUID(leftDoorAnimationUID);
    }
  });
  api.setCycleMode('one');
  api.pause();
  api.seekTo(0);
}



function onSuccess(api) {
  api.start();
  api.addEventListener('viewerready', function() {
    console.log('Viewer is ready');

    setupViewer(api);
    addButtonActions(api);
    

    // Debug
    api.addEventListener('click', function(info) {
      if (info.instanceID) {
        // Hit
        console.log('clicked node', info);
      }
    });
  });
}


function onError() {
  console.log('Viewer error');
}



const iframe = document.getElementById('api-frame');
const uid = 'f6da49a2c3e84e87a97823ec16000fbf';

// Requesting a specific version is optional.
const client = new Sketchfab('1.12.1', iframe);

client.init(uid, {
  success: onSuccess,
  error: onError,
  autostart: 1,
  ui_stop: 0,
  ui_theme: 'dark',
  dnt: 1
});

