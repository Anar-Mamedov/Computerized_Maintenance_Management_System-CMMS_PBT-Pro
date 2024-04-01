import { useState, useEffect } from "react";
import AxiosInstance from "../api/http";

const useFetch = (url, dependencies = []) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await AxiosInstance.get(url);
      if (response) {
        setData(response);
        setIsLoading(false);
      } else {
        console.error("API response is not in expected format");
      }
    } catch (error) {
      console.error("Error in API request:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url, ...dependencies]); // Include dependencies in the useEffect dependency array

  return [data, isLoading];
};

export default useFetch;
