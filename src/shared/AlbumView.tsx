import * as React from 'react';
import { definitions, IAlbum } from '../shared';
import { StyleSheet, css } from 'aphrodite/no-important';
import LabeledImage from './LabeledImage';

const defaultImage = require('../albums/albumDefault.svg') as string;
const styles = StyleSheet.create({
  ellipsis: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  labelText: {
    height: '90%',
    display: 'flex',
    maxWidth: 'calc(100% - 37px)',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  albumName: {
    fontSize: '0.7em',
    whiteSpace: 'normal',
    fontWeight: 700,
  },
  date: { fontSize: '0.6em' },
  cell: {
    top: '8px',
    left: '8px',
    backgroundColor: definitions.colors.darkGrey,
    position: 'absolute',
    width: 'calc(40% - 16px)',
    height: 'calc(100% - 16px)',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
  highlight: {
    position: 'absolute',
    left: '50%',
    bottom: 0,
    width: 0,
    height: '2px',
    backgroundColor: definitions.colors.primary,
    transition: `width ease-out ${definitions.transitions.fast}, 
               left ease-out ${definitions.transitions.fast}`,
  },
  noHover: {
    pointerEvents: 'none',
  }
});

interface IProps extends IAlbum {
  url?: string;
}

const AlbumView = ({ url, imageUrl, name, year, rating }: IProps) => (
  <LabeledImage imageUrl={imageUrl || defaultImage} url={url}>
    <div className={css(styles.labelText)}>
      <div className={css(styles.albumName)}>{name}</div>
      <div className={css(styles.ellipsis, styles.date)} >
        ({year || 'NA'})
           </div>
      <div className={css(styles.ellipsis)} >{rating}/10</div>
    </div>
  </LabeledImage>
);

export default AlbumView;