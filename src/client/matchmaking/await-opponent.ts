
export function awaitOpponent(socket: any): Promise<boolean> {
  
  return new Promise((resolve: (state: boolean) => void, reject: (r: any) => void) => {
    socket.on('opponent_found', () => {
      resolve(true);
    });
  });

}
