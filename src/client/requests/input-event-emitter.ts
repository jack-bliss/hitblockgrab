export function inputEventEmitter(elem: SVGElement, socket: any, game: number, player: string, data: any, event: string = 'click') {
  elem.addEventListener(event, () => {
    socket.emit('input', {
      data,
      game,
      player,
    });
  });
}
