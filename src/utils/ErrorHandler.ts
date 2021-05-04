function handle(err: Error) {
  if (err) {
    console.log(err.name)
    throw new Error(err.message)
  }
}

export { handle }