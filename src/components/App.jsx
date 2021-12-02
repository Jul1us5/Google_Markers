import React, { useState, useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import regeneratorRuntime from "regenerator-runtime";
import markerImg from "../img/pin.png";
import Titles from "./pages/Titles.jsx";
import Lists from "./pages/Lists.jsx";
import Loading from "./pages/Loading.jsx";
import DrawingManager from 'google-maps-drawing-tools';



import { BrowserRouter, Redirect, Link, Route } from "react-router-dom";

const App = () => {
  const [name, setName] = useState();
  const [list, setList] = useState([]);
  const [length, setLength] = useState(0);
  const [showList, setShowList] = useState();
  const [loading, setLoading] = useState(true);
  const [pre, setPre] = useState(false);

  const textInput = useRef();
  const titles = useRef();

  let map = [];
    
  const caller = () => {
    (async () => {
      async function getRepos() {
        const url = `${process.env.REACT_APP_API_KEY}`;

        const response = await fetch(url);
        const repositories = await response.json();

        return repositories;
      }
      const data = await getRepos();
      starter(data);
      setLoading(false);
     
    })();
  };

  useEffect(() => {
    caller();
  }, []);

  function setMarkers(map, data) {
    var image = new google.maps.MarkerImage(
      markerImg,
      // This marker is 20 pixels wide by 32 pixels tall.
      new google.maps.Size(20, 32),
      // The origin for this image is 0,0.
      new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at 0,32.
      new google.maps.Point(0, 32)
    );

    let marker;
    let markers = [];

    for (var i = 0; i < data.length; i++) {
      let myLatLng = new google.maps.LatLng(
        data[i].content[0],
        data[i].content[1]
      );
      marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: data[i].title,
        id: data[i]._id,
      });
        
      marker.setMap(map);
      markers.push(marker);

      
    }

    google.maps.event.addListener(map, "idle", function () {
      showVisibleMarkers(markers);
    });
      
  }

  function geocodeAddress(geocoder, resultsMap, input) {
    const address = input;

    geocoder.geocode({ address: address }).then(({ results }) => {
      const lat = results[0].geometry.location.lat();
      const lng = results[0].geometry.location.lng();

      saveData(lat, lng, address);
    });
  }

  function saveData(latCords, lngCords, text) {
    const data = {
      title: text,
      content: [latCords, lngCords],
      about: "...",
    };

    fetch(`${process.env.REACT_APP_API_KEY}`, {
      method: "POST", // or 'PUT'
      headers: {
          "Content-Type": "application/json",
          "mode":'no-cors'
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        caller();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function showVisibleMarkers(data) {
    let arr = [];
    let bounds = map.getBounds(),
      count = 0;

    for (let i = 0; i < data.length; i++) {
      let marker = data[i];

      if (bounds.contains(marker.getPosition()) === true) {
        arr.push([
          marker.title,
          marker.getPosition().lat(),
          marker.getPosition().lng(),
          marker.id,
        ]);
      }
    
    const contentString = `${marker.title}`;
    const infowindow = new google.maps.InfoWindow({
      content: contentString,
    });
        
      marker.addListener("mouseover", () => {
        infowindow.open({
            anchor: marker,
            map,
            shouldFocus: true,
          });
      });
    
    // assuming you also want to hide the infowindow when user mouses-out
    marker.addListener('mouseout', function() {
        infowindow.close();
    });

      google.maps.event.addListener(marker, "click", function () {
        map.panTo(this.getPosition());
        map.setZoom(8);
      });
    }
    setList(arr);
  }

  const deleteMarker = (id) => {

    fetch(`${process.env.REACT_APP_API_KEY}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(() => {
        caller();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const inputValue = textInput.current.value;
    const geocoder = new google.maps.Geocoder();

    geocodeAddress(geocoder, map, inputValue);
    textInput.current.value = "";
  };

  const starter = (data) => {
    const loader = new Loader({
      apiKey: `${process.env.REACT_APP_GOOGLE_API_KEY}`,
        version: "weekly",
        libraries: ['places']
    });

    loader.load().then(() => {
      const mapOptions = {
        center: new google.maps.LatLng(54.687157, 25.279652),
        zoom: 6,
      };

      map = new google.maps.Map(document.getElementById("map"), mapOptions);

      shows(data.length);
      setMarkers(map, data);
      setLength(data.length);
      
        setTimeout(() => {
            setPre(true);
        }, 200);
        
        const manager = new DrawingManager({ map });        
         
    });
  };

  const shows = (id) => {
    if (id == 0) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  };

  const handleParentFun = (value) => {
    deleteMarker(value);
  };

  return (
    <div className="wrapper">
      <div className="map" id="map"></div>
      <section className="section">
        <BrowserRouter>
          <header className="header">
            <nav>
              <Link to="titles">
                Žemelapis <span>{length}</span>
              </Link>
              {showList ? <Link to="lists">Sąrašai <span>1</span></Link> : ''}
            </nav>
          </header>
          <main className="main">
            <Route exact path="/reactMarker/dist/titles">
              <Titles
                data={list}
                empty={loading}
                show={setShowList}
                handleParentFun={(value) => {
                  handleParentFun(value);
                }}
              />
            </Route>
            <Route exact path="/reactMarker/dist/lists">
              <Lists list={showList} />
            </Route>
            <Redirect to="/reactMarker/dist/titles" />
          </main>
        </BrowserRouter>
        <footer className="footer">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              ref={textInput}
              placeholder="Vilnius, Kaunas..."
            />
            <input className="btn" type="submit" value="Pridėti" />
          </form>
        </footer>
      </section>
          <Loading open={pre}/>
    </div>
  );
};

export default App;
