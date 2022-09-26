import { useState, useEffect } from 'react';

export default function useAsync(handler, immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const act = (...args) => {
    setLoading(true);
    setError(null);
    return handler(...args)
      .then((dataReceived) => {
        setData(dataReceived);
        setLoading(false);
      })
      .catch((errorReceived) => {
        setError(errorReceived);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (immediate) {
      act();
    }
  }, []);

  return {
    data,
    loading,
    error,
    act,
  };
}
