import {
  State,
  Action,
  GET_ALBMS,
  GetAlbumsAction,
  makeGetAlbumsAction,
  SortBy,
  makeGetAlbumsSuccess,
  makeGetAlbumsFailed,
} from './types';
import { call, put, takeEvery, all } from 'redux-saga/effects';
import { LocationChangeAction, LOCATION_CHANGE } from 'connected-react-router';
import { Loading, NotRequested } from '../shared/types';
import { searchAlbums } from './api';
import { select, takeLatest } from 'redux-saga/effects';
import { IState as AppState } from '../store';
import { SearchRequest } from '../bands/types';
import { nextState } from '../shared/types/actions';
import { Unpack } from 'shared/types/Other';

const initialState: State = {
  albums: new NotRequested(),
  count: 0,
  request: {
    ratingLower: 0,
    ratingUpper: 10,
    yearLower: 0,
    yearHigher: new Date().getFullYear(),
    includeUnknown: true,
    name: '',
    sortBy: SortBy.RATING,
    sortOrderAsc: false,
    page: 0,
    itemsPerPage: 10,
  },
  filtersOpen: false,
};

function* fetchAlbums(action: GetAlbumsAction) {
  try {
    const prevReq: SearchRequest = yield select(
      (s: AppState) => s.albums.request,
    );
    const res: Unpack<typeof searchAlbums> = yield call(searchAlbums, {
      ...prevReq,
      ...action.payload,
    });
    yield put(
      makeGetAlbumsSuccess({
        albums: res.map(x => x.data).getOrElse([]),
        count: res.map(x => x.count).getOrElse(0),
      }),
    );
  } catch (e) {
    yield put(makeGetAlbumsFailed(e));
  }
}

function* dispatchGetAlbums() {
  yield put(makeGetAlbumsAction(initialState.request));
}

function* effects() {
  yield all([
    takeLatest(GET_ALBMS, fetchAlbums),
    takeEvery(
      (action: LocationChangeAction) =>
        action.type === LOCATION_CHANGE &&
        action.payload.location.pathname === '/albums',
      dispatchGetAlbums,
    ),
  ]);
}

const reducer = nextState<Action, State>(initialState, {
  '[Albums] Get albums': (a, s) => ({
    ...s,
    request: { ...s.request, ...a.payload },
    albums: new Loading(),
  }),
  '[Albums] Get albums done': (a, s) => ({
    ...s,
    count: a.payload.map(d => d.count).withDefault(0),
    albums: a.payload.map(d => d.albums),
  }),
  '[Albums] Toggle filters': (_, s) => ({ ...s, filtersOpen: !s.filtersOpen }),
});

export { reducer, initialState, effects };
