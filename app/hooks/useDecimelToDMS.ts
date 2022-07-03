const decimelToDMS = (decimel: number, lng: boolean) => {
  return [
    0 | decimel,
    '°',
    0 | (((decimel = (decimel < 0 ? -decimel : decimel) + 1e-4) % 1) * 60),
    "'",
    0 | (((decimel * 60) % 1) * 60),
    '" ',
    decimel < 0 ? (lng ? 'E' : 'S') : lng ? 'W' : 'N',
  ].join('');
};

export default decimelToDMS;
