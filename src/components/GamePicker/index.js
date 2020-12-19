import { Link, useHistory } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { v4 } from 'uuid';
import useLocalStorage from '../../hooks/useLocalStorage';
import generateRandomGrid from '../../utils/generateRandomGrid';
import GridPreview from '../GridPreview';
import * as christmas from '../../data/collections/christmas';

const useStyles = makeStyles({
  choices: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  choice: {
    minWidth: 300,
    margin: 10,
  },
  cardRoot: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});

export default function GamePicker() {
  const history = useHistory();
  const [existingGames, setExistingGames] = useLocalStorage(
    'existing-games',
    [],
  );

  const createNewGame = (grid) => {
    const id = v4();
    const cellData = grid.map((row, rowIdx) =>
      row.map((col, colIdx) => ({
        rowIdx,
        colIdx,
        cellMode: 0,
        error: false,
      })),
    );
    window.localStorage.setItem(
      `existing-games-${id}`,
      JSON.stringify({
        id,
        size: grid.length,
        grid,
        cellData,
        solved: false,
        created: new Date(),
        updated: new Date(),
      }),
    );
    setExistingGames([id, ...existingGames]);
    history.push(`/game/${id}`);
  };

  const createRandomGame = (size) => {
    const grid = generateRandomGrid(size);
    createNewGame(grid);
  };

  const createFromCollection = (collection) => {
    const grid = collection.data
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line)
      .map((line) =>
        line
          .split('')
          .map((item) => (item === 'x' ? { color: collection.color } : null)),
      );
    createNewGame(grid);
  };

  const continueGame = (game) => {
    history.push(`/game/${game.id}`);
  };

  const abandonGame = (gameId) => {
    if (!window.confirm('Are you sure?')) {
      return;
    }

    window.localStorage.removeItem(`existing-game-${gameId}`);
    setExistingGames(
      existingGames.filter((otherGameId) => otherGameId !== gameId),
    );
  };

  const sortedGames = existingGames
    .map((gameId) => {
      const storedGame = window.localStorage.getItem(
        `existing-games-${gameId}`,
      );
      if (!storedGame) {
        return null;
      }
      const parsedGame = JSON.parse(storedGame);
      parsedGame.created = parsedGame.created
        ? new Date(parsedGame.created)
        : null;
      parsedGame.updated = parsedGame.updated
        ? new Date(parsedGame.updated)
        : null;
      return parsedGame;
    })
    .sort((a, b) => (a.updated > b.updated ? -1 : 1));

  const ongoingGames = sortedGames.filter((game) => !game.solved);
  const finishedGames = sortedGames.filter((game) => game.solved);

  const categories = [
    {
      label: 'Continue',
      choices: ongoingGames.map((game) => ({
        game,
        label: `${game.size}x${game.size}`,
        display: (
          <>
            <Box
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box
                style={{ cursor: 'pointer' }}
                onClick={() => continueGame(game)}
              >
                <GridPreview
                  data={game.cellData}
                  color="#000000"
                  cellSize={150 / game.size}
                />
              </Box>
              {game.updated && (
                <Box color="secondary" style={{ fontSize: '.8em' }}>
                  Last played: {game.updated?.toLocaleString()}
                </Box>
              )}
            </Box>
          </>
        ),
        onClick: () => continueGame(game),
      })),
    },
    {
      label: 'Merry Christmas',
      choices: [
        {
          label: '1',
          onClick: () => createFromCollection(christmas.snowflake),
        },
      ],
    },
    {
      label: 'Random',
      choices: [
        {
          label: '10x10',
          onClick: () => createRandomGame(10),
        },
        {
          label: '15x15',
          onClick: () => createRandomGame(15),
        },
        {
          label: '20x20',
          onClick: () => createRandomGame(20),
        },
      ],
    },
    {
      label: 'Finished',
      choices: finishedGames.map((game) => ({
        game,
        label: `${game.size}x${game.size}`,
        display: (
          <>
            <Box
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box
                style={{ cursor: 'pointer' }}
                onClick={() => continueGame(game)}
              >
                <GridPreview
                  data={game.cellData}
                  color="#000000"
                  cellSize={150 / game.size}
                />
              </Box>
              {game.updated && (
                <Box color="secondary" style={{ fontSize: '.8em' }}>
                  Last played: {game.updated?.toLocaleString()}
                </Box>
              )}
            </Box>
          </>
        ),
        onClick: () => continueGame(game),
      })),
    },
  ];

  const classes = useStyles();

  return (
    <>
      {categories
        .filter((category) => category.choices && category.choices.length)
        .map((category) => (
          <Box key={category.label}>
            <h3>{category.label}</h3>
            <Box className={classes.choices}>
              {category.choices.map((choice) => (
                <Card
                  key={choice.game?.id ?? choice.label}
                  className={classes.choice}
                  classes={{ root: classes.cardRoot }}
                >
                  <CardContent>
                    <h4>{choice.label}</h4>
                    {choice.display}
                  </CardContent>
                  <CardActions>
                    <Box
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Button
                        component={choice.link ? Link : undefined}
                        to={choice.link}
                        onClick={choice.onClick}
                        variant="contained"
                        color="primary"
                      >
                        Play
                      </Button>

                      {choice.game && !choice.game.solved && (
                        <Button
                          onClick={() => abandonGame(choice.game.id)}
                          variant="outlined"
                          color="secondary"
                        >
                          Abandon
                        </Button>
                      )}
                    </Box>
                  </CardActions>
                </Card>
              ))}
            </Box>
          </Box>
        ))}
    </>
  );
}
