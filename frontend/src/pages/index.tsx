import { definePageConfig, useNavigate } from 'ice';
import { useEffect } from "react";
import store from '@/store';
import { INDEX_REDIRECT_TARGET } from '@/interfaces/config';

export default function SourcePage() {
  const [configModel] = store.useModel('config');
  const navigate = useNavigate();

  useEffect(() => {
    const properties = configModel ? configModel.properties : {};
    const redirectTarget = properties[INDEX_REDIRECT_TARGET] || '/route';
    navigate(redirectTarget, { replace: true });
  }, []);
}

export const pageConfig = definePageConfig(() => {
  return {
    title: 'Higress Console',
  };
});
