import { LocalState } from '../interfaces/local-state.interface';
import { renderState } from '../render/render';

export function listenForState(socket: any) {
  
  socket.on('state', (state: LocalState) => {
    console.log('state');
    renderState(state);
  });
  
}
