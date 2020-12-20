import { useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Game from '../Game';
import GamePicker from '../GamePicker';
import GridBuilder from '../GridBuilder';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 20,
    height: 'calc(100vh - 76px)',
    overflow: 'scroll',
  },
}));

function App() {
  const classes = useStyles();

  const history = useHistory();

  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });
    return () => {
      unlisten();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container className={classes.container}>
      <Switch>
        <Route exact={true} path="/">
          <GamePicker />
        </Route>
        <Route path="/game/:id">
          <Game />
        </Route>
        <Route path="/builder">
          <GridBuilder />
        </Route>
      </Switch>
    </Container>
  );
}

export default App;
