import { Button } from '@mezzanine-ui/react';
import classes from './login.module.scss';

function Login(): JSX.Element {
  return (
    <div className={classes.host}>
      Hello Template!
      <Button variant="contained">test</Button>
    </div>
  );
}

export default Login;
