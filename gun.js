let scatterplotLayer;
let heatmapLayer;
let hexagonLayer;
let deckgl;

const map = document.getElementById("map-container");
const tooltip = document.getElementById("tooltip");

    $(function() {
      $('input[name="daterange"]').daterangepicker({
        opens: 'left'
      }, function(start, end, label) {
        console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
      });
    });

    fetch('./gunData.json')
    .then(res => res.json())
    .then(data => {
      gunData = data;
      createScatterplot();
      createHeatMap();
      createHexagon();
      createDeck();
    })
    .catch(error => {
      console.log('Error:', error)
    }); 

const showToolTip = (object, x, y) => {
      console.log( object);
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;

      tooltip.innerHTML = `<div>Occurred on: ${object.date}</div>
                           <div>Death: ${object.n_killed} Injuried: ${object.n_injured}</div>
                           <div>Details: ${object.categories}</div>
                           <div></div>`

      tooltip.style.display = 'flex';
    }

const hideToolTip = () => {
  tooltip.style.display = 'none';
}

/*map.addEventListener('click', (e) => {
  const clickedElement = e.target;
  if(!clickedElement.closest('scatter') && clickedElement !== tooltip) {
    hideToolTip();
  }
}) */

const createDeck = () => { 
  deckgl = new deck.DeckGL({
      container: 'map-container',
      // Set your Mapbox access token here
      mapboxApiAccessToken: 'pk.eyJ1IjoiaHNraW04ODk0IiwiYSI6ImNsamd6cGwwdDBkaTEzcXA1bThiYjU0d3UifQ.ROUZosmduCnZ-BF8kdlw8A',

      mapStyle: 'mapbox://styles/mapbox/dark-v10',
      

      initialViewState: {
        latitude: 39.7392,
        longitude: -96.9903,
        zoom: 3.5,
        minZoom: 3,
        maxZoom: 18,
        bearing: 0,
        pitch: 0,
      },
      controller: true,
    
      /* Possible Layers: ScatterplotLayer, ArcLayer, LineLayer, PolygonLayer, GeoJsonLayer, IconLayer, TextLayer, HexagonLayer
      HeatmapLayer, 3D Layer, TripsLayer, Custom Layer*/
      layers: [scatterplotLayer, heatmapLayer, hexagonLayer],
      getTooltip: ({object}) => object && {
        html: `<div>Occurred on: ${object.date}</div>
        <div>Death: ${object.n_killed} Injuried: ${object.n_injured}</div>
        <div>Details: ${object.categories}</div>
        <div></div>`,
        style: {
          'background-color' : 'rgba(0, 0, 0, 0.5)',
          color: 'aliceblue',
          fontSize: '0.8em',
          'max-width': '500px'
        }
      }
    });

    const newLayer = deckgl.props.layers;
    }


    const createScatterplot = () => {
      scatterplotLayer = new deck.ScatterplotLayer({
      id: 'scatter',
      data: gunData,
      opacity: 0.8,
      filled: true,
      radiusMinPixels: 3,
      radiusMaxPixels: 6,
      getPosition: d => [d.longitude, d.latitude],
      getFillColor: d => d.n_killed > 0 ? [200, 0, 40, 150] : [255, 140, 0, 100],
      pickable: true
    })
  }

  const createHeatMap = () => {
    heatmapLayer = new deck.HeatmapLayer({
      id: 'heat',
      data: gunData,
      getPosition: d => [d.longitude, d.latitude],
      getWeight: d => d.n_killed + (d.n_injured * 0.5),
      radiusPixels: 60
    })
  }

  const createHexagon = () => {
    hexagonLayer = new deck.HexagonLayer({
      id: 'hex',
      data: gunData,
      getPosition: d => [d.longitude, d.latitude],
      getElevationWeight: d => (d.n_killed * 100) + d.n_injured,
      elevationScale: 100,
      extruded: true,
      opacity: 0.3
    })
  }

  /*
  onHover: ({object, x, y}) => {
        if(object) {
          showToolTip(object, x, y);
        } else {
          //console.log("out")
          hideToolTip();
        }
          /*info.object && alert(`${info.object.properties.name} (${info.object.properties.abbrev})`);*/
          
        
        /*
        const el = document.getElementById('tooltip');
        if(object) {
          const { n_killed, incident_id } = object;
          el.innerHTML = `<h1>${incident_id} Killed: ${n_killed}</h1>`;
          el.style.display = 'block';
          el.style.opacity;
          el.style.left = x + 'px';
          el.style.top = y + 'px';
        } else {
          el.style.opacity = 0.0;
        }*
      }




       getTooltip: ({object}) => object && {
        html: `<h2>${object.date}</h2><div>${object.categories}</div>`,
        style: {
          backgroundColor: '#f00',
          fontSize: '0.8em'
        }
      }
  */