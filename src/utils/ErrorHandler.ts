function handle(err, errorMessage: string) {
  if(err) {
    console.log(err)
    throw new Error(errorMessage)
  }
}

export { handle }