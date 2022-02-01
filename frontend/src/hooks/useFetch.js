import { useEffect, useState } from "react";

// Hook pour gerer la recuperation des donnees (chargement, erreurs...)
export default function useFetch(initialValue, apiCall) {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [apiCalled, setApiCalled] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiCall();
        setData(data);
      } catch (err) {
        console.error(apiCall.name, err);
        setError(err);
      }
      setApiCalled(true);
    })();
  }, [apiCall]);

  useEffect(() => {
    if (apiCalled) {
      setLoading(false);
    }
  }, [apiCalled, data]);

  return { data, loading, error };
}
