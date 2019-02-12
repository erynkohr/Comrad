import { artistAll } from './artist';
import { ARTIST_ALL, ARTIST_LOADING } from './types';
describe('artistAll', () => {
  let mockUrl;
  let mockDispatch;

  beforeEach(() => {
    mockUrl = 'www.someurl.com';
    mockDispatch = jest.fn();
  });

  it('call dispatch with the ARTIST_LOADING action', () => {
    const fetching = artistAll(mockUrl);
    fetching(mockDispatch);

    expect(mockDispatch).toHaveBeenCalledWith({ type: ARTIST_LOADING });
  });
});
