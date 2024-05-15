import React, { useState, useCallback, useEffect } from "react";
import { LoadScript, GoogleMap, Autocomplete } from "@react-google-maps/api";
import { Input, message } from "antd";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const libraries = ["places"];

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [position, setPosition] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [coordinates, setCoordinates] = useState(""); // Coordinates state

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setPosition(userLocation);
          setCoordinates(`${userLocation.lat}, ${userLocation.lng}`);
          if (map) {
            map.setCenter(userLocation);
            const marker = new window.google.maps.Marker({
              position: userLocation,
              map: map,
            });
            map.markers = [marker]; // Kullanıcının konumu için marker ekleme

            // Kullanıcının adresini alma ve yazdırma
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: userLocation }, (results, status) => {
              if (status === "OK" && results[0]) {
                setSearchQuery(results[0].formatted_address);
              } else {
                setSearchQuery("Adres bulunamadı");
              }
            });
          }
        },
        () => {
          // Kullanıcı konum iznini reddederse varsayılan konum
          const defaultPosition = { lat: -3.745, lng: -38.523 };
          setPosition(defaultPosition);
          setCoordinates(`${defaultPosition.lat}, ${defaultPosition.lng}`);
        }
      );
    } else {
      // Geolocation API'si tarayıcıda desteklenmiyorsa varsayılan konum
      const defaultPosition = { lat: -3.745, lng: -38.523 };
      setPosition(defaultPosition);
      setCoordinates(`${defaultPosition.lat}, ${defaultPosition.lng}`);
    }
  }, [map]);

  const onLoad = useCallback((map) => {
    map.markers = []; // Markerları saklamak için dizi oluşturma
    setMap(map);

    // Konum düğmesini ekleme
    const locationButton = document.createElement("button");
    locationButton.textContent = "📍";
    locationButton.classList.add("custom-map-control-button");
    locationButton.style.position = "absolute";
    locationButton.style.top = "10px";
    locationButton.style.right = "10px";
    locationButton.style.background = "#fff";
    locationButton.style.border = "none";
    locationButton.style.cursor = "pointer";
    locationButton.style.fontSize = "24px";
    locationButton.style.padding = "10px";
    map.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(
      locationButton
    );

    locationButton.addEventListener("click", () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setPosition(userLocation);
            setCoordinates(`${userLocation.lat}, ${userLocation.lng}`);
            map.setCenter(userLocation);

            // Mevcut markerları temizle
            map.markers.forEach((marker) => marker.setMap(null));
            map.markers = [];

            // Yeni marker ekle
            const marker = new window.google.maps.Marker({
              position: userLocation,
              map: map,
            });

            // Marker'ı diziye ekle
            map.markers.push(marker);

            // Kullanıcının adresini alma ve yazdırma
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: userLocation }, (results, status) => {
              if (status === "OK" && results[0]) {
                setSearchQuery(results[0].formatted_address);
              } else {
                setSearchQuery("Adres bulunamadı");
              }
            });
          },
          () => {
            alert("Konum alınamadı.");
          }
        );
      } else {
        alert("Tarayıcınız konum bilgisi sağlamıyor.");
      }
    });

    // Harita üzerinde tıklama olayını dinleme
    map.addListener("click", (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      const newPosition = { lat, lng };

      setPosition(newPosition);
      setCoordinates(`${lat}, ${lng}`);
      map.setCenter(newPosition);

      // Mevcut markerları temizle
      map.markers.forEach((marker) => marker.setMap(null));
      map.markers = [];

      // Yeni marker ekle
      const marker = new window.google.maps.Marker({
        position: newPosition,
        map: map,
      });

      // Marker'ı diziye ekle
      map.markers.push(marker);

      // Adresi güncelleme
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: newPosition }, (results, status) => {
        if (status === "OK" && results[0]) {
          setSearchQuery(results[0].formatted_address);
        } else {
          setSearchQuery("Adres bulunamadı");
        }
      });
    });
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const newPosition = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setPosition(newPosition);
        setCoordinates(`${newPosition.lat}, ${newPosition.lng}`);
        map.setCenter(newPosition);

        // Mevcut markerları temizle
        map.markers.forEach((marker) => marker.setMap(null));
        map.markers = [];

        // Yeni marker ekle
        const marker = new window.google.maps.Marker({
          position: newPosition,
          map: map,
        });

        // Marker'ı diziye ekle
        map.markers.push(marker);

        // Seçilen yeri input alanına yazma
        setSearchQuery(place.formatted_address || place.name);
      }
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  const handleCoordinatesChange = (e) => {
    const value = e.target.value;
    setCoordinates(value);

    const [lat, lng] = value
      .split(",")
      .map((coord) => parseFloat(coord.trim()));
    if (!isNaN(lat) && !isNaN(lng)) {
      const newPosition = { lat, lng };
      setPosition(newPosition);
      map.setCenter(newPosition);

      // Mevcut markerları temizle
      map.markers.forEach((marker) => marker.setMap(null));
      map.markers = [];

      // Yeni marker ekle
      const marker = new window.google.maps.Marker({
        position: newPosition,
        map: map,
      });

      // Marker'ı diziye ekle
      map.markers.push(marker);

      // Adresi güncelleme
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: newPosition }, (results, status) => {
        if (status === "OK" && results[0]) {
          setSearchQuery(results[0].formatted_address);
        } else {
          setSearchQuery("Adres bulunamadı");
        }
      });
    } else {
      message.error("Geçersiz koordinatlar");
    }
  };

  return (
    <>
      {position && (
        <LoadScript
          googleMapsApiKey="AIzaSyDUqW8OQobjsng1Nm0XJKBs0LNvSgq0yfw"
          libraries={libraries}
        >
          <Autocomplete
            onLoad={setAutocomplete}
            onPlaceChanged={onPlaceChanged}
          >
            <Input.Search
              placeholder="Konum giriniz"
              enterButton="Ara"
              size="large"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ marginBottom: "10px" }}
            />
          </Autocomplete>
          <Input
            placeholder="Koordinatlar giriniz (örneğin: 40.7128, -74.0060)"
            value={coordinates}
            onChange={handleCoordinatesChange}
            style={{ marginBottom: "20px" }}
          />
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={position}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
          ></GoogleMap>
        </LoadScript>
      )}
    </>
  );
};

export default MapComponent;
