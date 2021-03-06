import { sequential, layers, train, Sequential } from '@tensorflow/tfjs';

// Define the architecture of the model.
// Setup Layers & Compile model
export function buildModel(): Sequential {
  const model = sequential(); // Sequential model
  const { conv2d, maxPooling2d, flatten, dense } = layers;

  // In the first layer of convolutional neural network we have
  // to specify the input shape. Then we specify some parameters for
  // the convolution operation that takes place in this layer.
  model.add(
    conv2d({
      inputShape: [28, 28, 1], // [row, column, depth]
      kernelSize: 5,
      filters: 8,
      strides: 1,
      activation: 'relu', // RELU: Returns maximum of 0 and input
      kernelInitializer: 'varianceScaling'
    })
  );

  // The MaxPooling layer acts as a sort of downsampling using max values
  // in a region instead of averaging.
  model.add(maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));

  // Repeat another conv2d + maxPooling stack.
  // Note that we have more filters in the convolution.
  model.add(
    conv2d({
      kernelSize: 5,
      filters: 16,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'varianceScaling'
    })
  );
  model.add(maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));

  // Now we flatten the output from the 2D filters into a 1D vector to prepare
  // it for input into our last layer. This is common practice when feeding
  // higher dimensional data to a final classification output layer.
  model.add(flatten());

  // Our last layer is a dense layer which has 10 output units, one for each
  // output class (i.e. 0, 1, 2, 3, 4, 5, 6, 7, 8, 9).
  const NUM_OUTPUT_CLASSES = 10;
  model.add(
    dense({
      units: NUM_OUTPUT_CLASSES,
      kernelInitializer: 'varianceScaling',
      activation: 'softmax'
    })
  );

  // Choose an optimizer, loss function and accuracy metric,
  // then compile and return the model.
  // Optimizer - Tell our model how to improve. 
  // Loss      - Sets our way to evaluate our model's error(loss).
  // Metrics   - Evaluate the performance of our model.
  model.compile({
    optimizer: train.adam(), // The optimizer we’re using here is the Adam optimizer. Adam, aka Adaptive Moment Estimation, is a schotastic gradient descent method.
    loss: 'categoricalCrossentropy', // Since the data is all handwritten digits with labels between 0-9 , we will use Categorical Crossentropy which is great for performing multi-class classification, which we are using here.
    metrics: ['accuracy'] // How we're evaluating our model.
  });

  return model; // Returns our model
}
