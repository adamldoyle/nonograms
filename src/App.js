import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextLink from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Game from './components/Game';
import GamePicker from './components/GamePicker';
import GridBuilder from './components/GridBuilder';

const useStyles = makeStyles((theme) => ({
  appBar: { borderBottom: `1px solid ${theme.palette.divider}` },
  toolbar: { flexWrap: 'wrap' },
  toolbarTitle: { flexGrow: 1 },
  link: { margin: theme.spacing(1, 1.5) },
  toolbarOffset: theme.mixins.toolbar,
  container: {
    marginTop: '20px',
  },
}));

function App() {
  const classes = useStyles();

  return (
    <Router>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        className={classes.appBar}
      >
        <Toolbar className={classes.toolbar}>
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            className={classes.toolbarTitle}
          >
            <TextLink component={Link} variant="h5" color="textPrimary" to="/">
              Nonograms
            </TextLink>
          </Typography>
          <nav>
            {/* <Link
              variant="button"
              color="textPrimary"
              href="#"
              className={classes.link}
            >
              Features
            </Link> */}
          </nav>
        </Toolbar>
      </AppBar>
      <Box className={classes.toolbarOffset} />
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
    </Router>
  );
}

export default App;
