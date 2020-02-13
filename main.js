const citiesData = `
“Nashville, TN”, 36.17, -86.78;
“New York, NY”, 40.71, -74.00;
“Atlanta, GA”, 33.75, -84.39;
“Denver, CO”, 39.74, -104.98;
“Seattle, WA”, 47.61, -122.33;
“Los Angeles, CA”, 34.05, -118.24;
“Memphis, TN”, 35.15, -90.05;
`;


class City {
  constructor(name, state, latitude, longitude) {
    this.name = name;
    this.state = state;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}


let cities = []; // array to held initial values as objects



const strToObj = string => {  

  // regexp to match any latitudes and longitudes in the given string
  const numRegExp = new RegExp(/(\-?\d+(\.\d+)?)\s*(\-?\d+(\.\d+)?)/, 'g');
  
  // regexp to match words in the given string
  const lettersRegExp = new RegExp(/[a-zA-Z][ a-zA-Z]+/, 'g');

  // creating an array and removeng all line breaks, whitespaces and empty slots
  const citiesArr = string.split(';')
                          .map(city => city.trim())
                          .filter(city => city !== '');


  // separate cities and states from latitudes and longitudes and pushing them to the 'cities' array

  for(let i = 0; i < citiesArr.length; i++) {
    const nameAndState = citiesArr[i].match(lettersRegExp);
    const latsAndLongs = citiesArr[i].match(numRegExp).map(num => +num); // convert str into num


    const city = new City(nameAndState[0], nameAndState[1], latsAndLongs[0], latsAndLongs[1]);

    cities.push(city);
  }
}

strToObj(citiesData);



// get saved data

let savedCities = JSON.parse(window.localStorage.getItem('savedCities')) || [...cities]

const saveToStorage = () => {
  window.localStorage.setItem('savedCities', JSON.stringify(savedCities));
}


class CityMap extends City {

  // methods of the class

  getNorthernMostCity() {
    
    // 90 is the northernmost poin on Earth

    let result = savedCities.reduce((prev, next) => {
      return (Math.abs(next.latitude - 90) < Math.abs(prev.latitude - 90) ? next : prev)
    });

    console.log(`The northernmost city is ${result.name}`);

    return `The northernmost city is ${result.name}`
  }

  getEasternMostCity() {

    // 180 is the easternmost poin on Earth
    let result = savedCities.reduce((prev, next) => {
      return (Math.abs(next.longitude - 180) < Math.abs(prev.longitude - 180) ? next : prev)
    });

    console.log(`The easternmost city is ${result.name}`);

    return `The easternmost city is ${result.name}`
  }

  getSouthernMostCity() {
    // 0 is the southernmost poin on Earth
    // i.e. latitude - 0

    let result = savedCities.reduce((prev, next) => {
      return (Math.abs(next.latitude) < Math.abs(prev.latitude) ? next : prev)
    });

    console.log(`The southernmost city is ${result.name}`);

    return `The southernmost city is ${result.name}`
  }

  getWesternMostCity() {
    // -180 is the westernmost poin on Earth

    let result = savedCities.reduce((prev, next) => {
      return (Math.abs(next.longitude - -180) < Math.abs(prev.longitude - -180) ? next : prev)
    });

    console.log(`The westernmost city is ${result.name}`);

    return `The westernmost city is ${result.name}`
  }



  getClosestCity(lat, long) {
    
    const degToRad = deg => {
      return deg * (Math.PI / 180);
    }

    let distances = []; // distances (km)

    let nameAndDistance = savedCities.map((city, index) => {
      let cityName = city[index].name;
      let lat1 = city[index].latitude;
      let long1 = city[index].longitude;
      let lat2 = lat;
      let long2 = long;

      // Harvesive formula here
    
      let R = 6371; // Radius of Earth in km

      let degLat = degToRad(lat2 - lat1); 
      let degLon = degToRad(long2 - long1);

      let a = Math.sin(degLat / 2) * Math.sin(degLat / 2) +
              Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
              Math.sin(degLon / 2) * Math.sin(degLon / 2);

      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));


      let distance = R * c; 

      let distanceShort = Math.round(distance * 100) / 100; // shorten mantissa up to 2 numbers

      distances.push(distanceShort); 

      return [cityName, distanceShort]; 
    })


    let minDist = Math.min(...distances); 
    let closestCity; 

    nameAndDistance.forEach(city => {
      if(city[1] == minDist) { // city[0]: name of a city 
        closestCity = city[0]; // city[1]: distance
      }
    });

    console.log(`The closest city is ${closestCity}`);

    return `The closest city is ${closestCity}`;
  }


  getStatesAbbrs() {
    const abbreviations = savedCities.reduce((states, city) => {
      if(!states.includes(city.state)) { // if array does not include name of the state
        return [...states, city.state];  // push the state into this array
      } else {
        return states;
      }
    }, [])

    const result = abbreviations.join().replace(/,/g, ' ').trim(); //replace commas with spaces

    console.log(result);

    return result;
  }


  searchByState(state) {
    const citiesInState = [];
    let result;

    if(typeof state !== 'string') {
      alert('Please type in state abbreviation');
    } else {
      savedCities.forEach(city => {
        if(city.state === state) {
          citiesInState.push(city.name);
        }
      });

      citiesInState.length === 0 ? 
      alert('No city is found in this state') :
      citiesInState.length > 1 ? 
      result = `The cities in this state: ${citiesInState.join().replace(/,/g, ', ')}` : 
      result = `The city in this state: ${citiesInState.join().replace(/,/g, ', ')}`;
    } 

    return result;
  }

}

const city = new CityMap(citiesData);

// calling all the methods

// city.getNorthernMostCity();
// city.getEasternMostCity();
// city.getSouthernMostCity();
// city.getWesternMostCity();
// console.log(city.getClosestCity(36.17, -86.78));
// console.log(city.getStatesAbbrs());

// city.searchByState('TN');







// -------------------------------- UI ----------------------------------------------

window.addEventListener('load', () => {
  renderWholeList(savedCities);
});


const DOM = {
  resultsBox: document.querySelector('.cities__result'),
  wholeListBtn: document.querySelector('.cities__button-full'),
  northBtn: document.querySelector('.cities__button-north'),
  eastBtn: document.querySelector('.cities__button-east'),
  southBtn: document.querySelector('.cities__button-south'),
  westBtn: document.querySelector('.cities__button-west'),
  findClosestBtn: document.querySelector('.cities__closest'),
  abbrBtn: document.querySelector('.cities__abbr'),
  searchByStateBtn: document.querySelector('.cities__search-by-state'),
  addNewCityBtn: document.querySelector('.cities__add')
}

const clearResults = () => {
  DOM.resultsBox.innerHTML = '';
}

const renderWholeList = list => {
  clearResults();
  list.forEach(city => {
    const cityInfo = `
    <p class="cities__results">
      <div><span class="results__point">City: </span>${city.name}</div>
      <div><span class="results__point">State: </span>${city.state}</div>
      <div><span class="results__point">Latitude: </span>${city.latitude}</div>
      <div><span class="results__point">Longitude: </span>${city.longitude}</div>
    </p>
    `;

    DOM.resultsBox.insertAdjacentHTML('afterbegin', cityInfo);
  })
}

const render = extremePoint => {
  clearResults();
  DOM.resultsBox.insertAdjacentHTML('afterbegin', extremePoint);
}

DOM.wholeListBtn.addEventListener('click', () => {
  renderWholeList(savedCities);
});

DOM.northBtn.addEventListener('click', () => {
  render(city.getNorthernMostCity());
});

DOM.eastBtn.addEventListener('click', () => {
  render(city.getEasternMostCity());
});

DOM.southBtn.addEventListener('click', () => {
  render(city.getSouthernMostCity());
});

DOM.westBtn.addEventListener('click', () => {
  render(city.getWesternMostCity());
});

DOM.findClosestBtn.addEventListener('click', () => {
  clearResults();
  const lat = +prompt('Please enter latitude', 0);
  const long = +prompt('Please enter longitude', 0);


  if(typeof lat !== 'number' || typeof long !== 'number' || lat === 0 || long === 0) {
    alert('Invalid parameters. Please, type in numbers')
  } else {
    const confirmation = confirm(`Your parameters: latitude: ${lat}, longitude: ${long}`);

    if(confirmation) {
      render(city.getClosestCity(lat, long));
    }
  }
});

DOM.abbrBtn.addEventListener('click', () => {
  render(city.getStatesAbbrs())
});

DOM.searchByStateBtn.addEventListener('click', () => {
  const state = prompt('Please enter a state abbreviation', 'TN').toUpperCase();
  render(city.searchByState(state));
});

DOM.addNewCityBtn.addEventListener('click', () => {
  const name = prompt('Name of a city', 'Chicago');
  const state = prompt('Name of the state', 'IL');
  const lat = +prompt('Latitude', '41.87');
  const long = +prompt('Longitude', '87.62');

  if(typeof lat !== 'number'  // it needs more precise check, of course :)
    || typeof long !== 'number' 
    || lat === 0 
    || long === 0
    || state.length > 2) {
    alert('Invalid parameters')
  }
  
    else {
    savedCities.push(new City(name, state, lat, long));
    saveToStorage(); // save new city to the localStorage
    renderWholeList(savedCities);
  }
});





  
