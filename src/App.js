import { BrowserRouter as Router, Link } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextLink from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import PageContainer from './components/PageContainer';

const useStyles = makeStyles((theme) => ({
  appBar: { borderBottom: `1px solid ${theme.palette.divider}` },
  toolbar: { flexWrap: 'wrap' },
  toolbarTitle: { flexGrow: 1 },
  link: { margin: theme.spacing(1, 1.5) },
  toolbarOffset: theme.mixins.toolbar,
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
      <PageContainer />
    </Router>
  );
}

export default App;
