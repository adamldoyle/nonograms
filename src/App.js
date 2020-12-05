import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Game from './components/Game';

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

  const size = 10;

  return (
    <>
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
            <Link variant="h5" color="textPrimary" href="/">
              Nonograms
            </Link>
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
      <div className={classes.toolbarOffset} />
      <Container className={classes.container}>
        <Box>
          <Game size={size} key={size} />
        </Box>
      </Container>
    </>
  );
}

export default App;
