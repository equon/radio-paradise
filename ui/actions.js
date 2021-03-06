import jsonp from 'jsonp';
import * as player from './player';

const API_CHECK_PERIOD = 2000;

export const PLAY = 'PLAY';
export const STOP = 'STOP';
export const TOGGLE = 'TOGGLE';
export const GETTING_SONGS = 'GETTING_SONGS';
export const GOT_NEW_SONGS = 'GOT_NEW_SONGS';
export const CANNOT_GET_SONGS = 'CANNOT_GET_SONGS';

export function gettingSongs () {
  return {
    type: GETTING_SONGS
  };
}

export function gotNewSongs (songs) {
  return {
    type: GOT_NEW_SONGS,
    songs
  };
}

export function cannotGetSongs (error) {
  return {
    type: CANNOT_GET_SONGS,
    error
  };
}

export function fetch () {
  return dispatch => {
    dispatch({ type: GETTING_SONGS });
    checkAPI(dispatch);
  }
}

export function play () {
  player.play();

  return {
    type: PLAY
  };
}

export function stop () {
  player.stop();

  return {
    type: STOP
  };
}

export function toggle () {
  return (dispatch, state) => {
    if (state().player) {
      return dispatch(stop());
    } else {
      return dispatch(play());
    }
  };
}

function checkAPI (dispatch) {
  jsonp('/api/now', (error, response) => {
    if (error) {
      return dispatch(cannotGetSongs(error));
    }

    dispatch(gotNewSongs(response.songs));

    setTimeout(checkAPI, API_CHECK_PERIOD, dispatch);
  });
}
