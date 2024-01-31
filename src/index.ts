import * as tf from '@tensorflow/tfjs-node-gpu'

async function makeDataset(csvUrl: string) {
  const ys = ['y1']
  const csvDataset = tf.data.csv(csvUrl, {
    columnConfigs: Object.fromEntries(ys.map((y) => [y, { isLabel: true }])),
  })

  const dataset = csvDataset
    .map((a: any) => {
      const xs = [Object.values<number>(a.xs)]
      const ys = [Object.values<number>(a.ys)]

      return { xs: xs, ys: ys }
    })
    .batch(2, false) 

  return  dataset
}

async function run() {
  const trainingData = await makeDataset(`file://${process.cwd()}/assets/data.csv`)

  const model = tf.sequential()
  model.add(
    tf.layers.lstm({
      inputShape: [1, 2],
      units: 1,
      returnSequences: false,
    }),
  )
  model.add(
    tf.layers.dense({
      units: 1,
    }),
  )
  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.metrics.meanSquaredError,
  })

  console.log('------------------ Model summary ------------------')
  model.summary()

  return model.fitDataset(trainingData, {
    epochs: 10,
  })
}

void run()
