function* main(): Generator<Promise<string>, void, string> {
  let sum = 0;
  sum += +(yield wait(3000));
  console.log("Three seconds passed, time for next yield");
  sum += +(yield wait(2000));
  console.log("Two seconds passed, time for next yield");
  sum += +(yield wait(1000));
  console.log("One second passed, time for next yield");
  console.log(`Now we have waited in total: ${sum / 1000} seconds`);
}

run(main);

function run(generatorFunction: {
  (): Generator<Promise<string>, void, unknown>;
  (): any;
}) {
  const generator = generatorFunction();
  return new Promise((resolve) => step(generator, resolve));
}

function step(
  generator: ReturnType<GeneratorFunction>,
  resolve: (value: unknown) => void,
  resolvedValue?: any
) {
  const result = generator.next(resolvedValue);

  if (result.done) return resolve(result.value);

  Promise.resolve(result.value).then((resolvedValue: any) =>
    step(generator, resolve, resolvedValue)
  );
}

function wait(time: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Time passed: ", time);
      resolve(time.toString());
    }, time);
  });
}
