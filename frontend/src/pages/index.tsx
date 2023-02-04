import { definePageConfig, useNavigate } from 'ice';
import { useEffect } from "react";

export default function SourcePage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/route', { replace: true });
  }, []);
  return;
}

export const pageConfig = definePageConfig(() => {
  return {
    title: 'Higress Console'
  };
});
