import store from '@/store';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [systemState] = store.useModel('system');

  return (
    <div style={{ textAlign: 'center', margin: 10 }}>
      &copy; {currentYear} Higress
      {
        systemState.version && (
          <>
            <br />
            v{systemState.version}
          </>
        )
      }
    </div>
  );
};

export default Footer;
