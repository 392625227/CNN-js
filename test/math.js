const { expect } = require(`chai`);
var {
  matrixMultiply,
  matrixDot,
  transpose,
  convolute,
  doubleInverse,
  correlate,
  getDimension,
  maxPool,
  flattenDeep,
  matrixAdd,
  deepMap,
  update2Dmatrix,
  max,
  sum,
  softmax,
  maxIndex
} = require("../math");

describe("Basic math functions", () => {
  it(`deep map`, () => {
    expect(
      deepMap(
        [
          [
            [1, 2, 3],
            [3, 2, 1]
          ],
          [
            [1, 2, 3],
            [3, 2, 1]
          ]
        ],
        v => v + 1
      )
    ).to.eql([
      [
        [2, 3, 4],
        [4, 3, 2]
      ],
      [
        [2, 3, 4],
        [4, 3, 2]
      ]
    ]);
  });
  it(`matrix dimension recognition`, () => {
    let m1 = [1, 2, 3, 4],
      m2 = [
        [1, 2, 3, 4],
        [1, 2, 3, 4],
        [1, 2, 3, 4],
        [1, 2, 3, 4]
      ],
      m3 = [
        [
          [1, 2, 3, 4],
          [1, 2, 3, 4],
          [1, 2, 3, 4],
          [1, 2, 3, 4]
        ],
        [
          [1, 2, 3, 4],
          [1, 2, 3, 4],
          [1, 2, 3, 4],
          [1, 2, 3, 4]
        ],
        [
          [1, 2, 3, 4],
          [1, 2, 3, 4],
          [1, 2, 3, 4],
          [1, 2, 3, 4]
        ]
      ];

    expect(getDimension(m1)).to.eql(1);
    expect(getDimension(m2)).to.eql(2);
    expect(getDimension(m3)).to.eql(3);
    expect(getDimension([m3])).to.eql(4);
  });
  describe(`matrix dot product`, () => {
    it(`throws error on invalid dimensions`, () => {
      expect(() => {
        matrixDot([[1, 2]], [[1, 2, 3, 4]]);
      }).to.throw();
    });
    it(`multiplies`, () => {
      expect(
        matrixDot(
          [
            [3, 1, 1, 4],
            [5, 3, 2, 1],
            [6, 2, 9, 5]
          ],
          [
            [4, 9],
            [6, 8],
            [9, 7],
            [7, 6]
          ]
        )
      ).to.eql([
        [55, 66],
        [63, 89],
        [152, 163]
      ]);
    });
  });

  it(`transpose`, () => {
    expect(transpose([[1], [2], [3]])).to.eql([[1, 2, 3]]);

    expect(
      transpose([
        [11, 12, 13, 14],
        [21, 22, 23, 24]
      ])
    ).to.eql([
      [11, 21],
      [12, 22],
      [13, 23],
      [14, 24]
    ]);
  });

  it(`matrix multiplication`, () => {
    expect(
      matrixMultiply(
        [
          [1, 2, 3, 4],
          [3, 2, 1, 4],
          [5, 2, 3, 6],
          [2, 9, 9, 4]
        ],
        [
          [0, 0, 0, 1],
          [2, 3, 0, 0],
          [0, 0, 0, 0],
          [1, 2, 0, 0]
        ]
      )
    ).to.eql([
      [0, 0, 0, 4],
      [6, 6, 0, 0],
      [0, 0, 0, 0],
      [2, 18, 0, 0]
    ]);

    expect(
      matrixMultiply(
        [
          [1, 2, 3, 4, 5, 6, 10],
          [3, 4, 2, 3, 5, 2, 3]
        ],
        [
          [0, 0, 0, 2, 0, 1, 0],
          [0, 1, 0, 0, 2, 0, 0]
        ]
      )
    ).to.eql([
      [0, 0, 0, 8, 0, 6, 0],
      [0, 4, 0, 0, 10, 0, 0]
    ]);

    expect(
      matrixMultiply(
        [
          [
            [1, 2, 3, 4],
            [4, 3, 2, 1],
            [2, 1, 0, 2]
          ],
          [
            [1, 2, 3, 4],
            [0, 3, 1, 2],
            [5, 2, 1, 0]
          ]
        ],
        [
          [
            [0, 0, 1, 0],
            [0, 1, 0, 2],
            [1, 1, 1, 1]
          ],
          [
            [0, 0, 1, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 1]
          ]
        ]
      )
    ).to.eql([
      [
        [0, 0, 3, 0],
        [0, 3, 0, 2],
        [2, 1, 0, 2]
      ],
      [
        [0, 0, 3, 0],
        [0, 3, 0, 0],
        [0, 0, 0, 0]
      ]
    ]);

    expect(() => {
      matrixMultiply(
        [
          [1, 2, 3],
          [1, 2, 3]
        ],
        [
          [1, 2],
          [1, 2]
        ]
      );
    }).to.throw();
  });

  it(`matrix addition`, () => {
    expect(matrixAdd([1, 2, 3], [3, 2, 1])).to.eql([4, 4, 4]);

    expect(
      matrixAdd(
        [
          [1, 2, 3],
          [0, 0, 0],
          [3, 2, 1]
        ],
        [
          [4, 3, 2],
          [1, 1, 1],
          [0, 0, 1]
        ]
      )
    ).to.eql([
      [5, 5, 5],
      [1, 1, 1],
      [3, 2, 2]
    ]);

    expect(
      matrixAdd(
        [
          [
            [1, 2, 3],
            [0, 0, 0],
            [3, 2, 1]
          ]
        ],
        [
          [
            [4, 3, 2],
            [1, 1, 1],
            [0, 0, 1]
          ]
        ]
      )
    ).to.eql([
      [
        [5, 5, 5],
        [1, 1, 1],
        [3, 2, 2]
      ]
    ]);
  });

  it(`double inverse`, () => {
    expect(
      doubleInverse([
        [
          [1, 3, 2, 4],
          [2, 2, 3, 4],
          [5, 2, 3, 4]
        ],
        [
          [1, 3, 2, 4],
          [2, 2, 3, 4],
          [5, 2, 3, 4]
        ]
      ])
    ).to.eql([
      [
        [4, 3, 2, 5],
        [4, 3, 2, 2],
        [4, 2, 3, 1]
      ],
      [
        [4, 3, 2, 5],
        [4, 3, 2, 2],
        [4, 2, 3, 1]
      ]
    ]);

    expect(
      doubleInverse([
        [1, 3, 2, 4],
        [2, 2, 3, 4],
        [5, 2, 3, 4]
      ])
    ).to.eql([
      [4, 3, 2, 5],
      [4, 3, 2, 2],
      [4, 2, 3, 1]
    ]);

    expect(
      doubleInverse([
        [
          [1, 3, 2, 4],
          [2, 2, 3, 4],
          [5, 2, 3, 4]
        ],
        [
          [4, 3, 2, 5],
          [4, 3, 2, 2],
          [4, 2, 3, 1]
        ]
      ])
    ).to.eql([
      [
        [4, 3, 2, 5],
        [4, 3, 2, 2],
        [4, 2, 3, 1]
      ],
      [
        [1, 3, 2, 4],
        [2, 2, 3, 4],
        [5, 2, 3, 4]
      ]
    ]);

    expect(doubleInverse([1, 2, 3, 4])).to.eql([4, 3, 2, 1]);
  });

  it(`convolute`, () => {
    expect(
      convolute(
        [
          [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
          ]
        ],
        [
          [
            [
              [-1, -2, -1],
              [0, 0, 0],
              [1, 2, 1]
            ]
          ]
        ],
        1,
        1
      )
    ).to.eql([
      [
        [-13, -20, -17],
        [-18, -24, -18],
        [13, 20, 17]
      ]
    ]);

    expect(
      convolute(
        [
          [
            [1, 2, 3, 1, 2],
            [3, 4, 1, 2, 3],
            [1, 1, 2, 1, 4]
          ]
        ],
        [
          [
            [
              [0, 0, -1],
              [0, 0, 1],
              [0, 2, 1]
            ]
          ]
        ],
        1,
        1
      )
    ).to.eql([
      [
        [0, -2, -2, 2, -1],
        [2, 7, 11, 4, 6],
        [6, 12, 7, 7, 9]
      ]
    ]);

    expect(
      convolute(
        [
          [
            [1, 0, 2, 1],
            [3, 1, 2, 1],
            [3, 1, 1, 0]
          ]
        ],
        [
          [
            [
              [0, 0, 0],
              [1, 0, 1],
              [0, 1, 2]
            ]
          ]
        ],
        2,
        1
      )
    ).to.eql([
      [
        [0, 1],
        [4, 5]
      ]
    ]);
  });

  it(`correlate`, () => {
    expect(
      correlate(
        [
          [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
          ]
        ],
        [
          [
            [
              [1, 2, 1],
              [0, 0, 0],
              [-1, -2, -1]
            ]
          ]
        ],
        1,
        1
      )
    ).to.eql([
      [
        [-13, -20, -17],
        [-18, -24, -18],
        [13, 20, 17]
      ]
    ]);

    expect(
      correlate(
        [
          [
            [1, 2, 3, 1, 2],
            [3, 4, 1, 2, 3],
            [1, 1, 2, 1, 4]
          ]
        ],
        [
          [
            [
              [1, 2, 0],
              [1, 0, 0],
              [-1, 0, 0]
            ]
          ]
        ],
        1,
        1
      )
    ).to.eql([
      [
        [0, -2, -2, 2, -1],
        [2, 7, 11, 4, 6],
        [6, 12, 7, 7, 9]
      ]
    ]);

    expect(
      correlate(
        [
          [
            [1, 0, 2, 1],
            [3, 1, 2, 1],
            [3, 1, 1, 0]
          ]
        ],
        [
          [
            [
              [2, 1, 0],
              [1, 0, 1],
              [0, 0, 0]
            ]
          ]
        ],
        2,
        1
      )
    ).to.eql([
      [
        [0, 1],
        [4, 5]
      ]
    ]);

    expect(
      correlate(
        [
          [
            [2, 1, 2, 1, 2],
            [1, 2, 0, 2, 2],
            [1, 0, 2, 0, 1],
            [0, 0, 2, 2, 0],
            [2, 1, 0, 0, 1]
          ],
          [
            [2, 2, 0, 0, 2],
            [2, 2, 1, 1, 1],
            [2, 1, 0, 1, 0],
            [1, 0, 0, 1, 0],
            [0, 2, 0, 0, 1]
          ],
          [
            [2, 2, 0, 0, 2],
            [1, 1, 0, 0, 1],
            [2, 2, 1, 2, 1],
            [1, 0, 2, 0, 1],
            [1, 2, 2, 0, 0]
          ]
        ],
        [
          [
            [
              [-1, 1, 0],
              [0, -1, 0],
              [0, 0, -1]
            ],
            [
              [-1, -1, 0],
              [0, 0, 1],
              [0, -1, -1]
            ],
            [
              [-1, 0, 1],
              [1, 1, -1],
              [1, 1, -1]
            ]
          ],
          [
            [
              [-1, -1, 1],
              [1, 1, 1],
              [0, 1, 0]
            ],
            [
              [-1, -1, 1],
              [1, 0, 1],
              [-1, -1, 0]
            ],
            [
              [-1, 0, -1],
              [-1, -1, 0],
              [0, 0, 1]
            ]
          ]
        ],
        2,
        1,
        [1, 0]
      )
    ).to.eql([
      [
        [-5, -2, 1],
        [1, -6, 2],
        [-1, 7, -3]
      ],
      [
        [3, 1, 1],
        [-1, 0, -8],
        [3, 0, -2]
      ]
    ]);
  });

  it(`maxPooling`, () => {
    expect(
      maxPool(
        [
          [
            [1, 1, 2, 4],
            [5, 6, 7, 8],
            [3, 2, 1, 0],
            [1, 2, 3, 4]
          ]
        ],
        2,
        2
      )
    ).to.eql([
      [
        [6, 8],
        [3, 4]
      ]
    ]);

    expect(
      maxPool(
        [
          [
            [-1, -1, -2, -4],
            [-5, -6, -7, -8],
            [-3, -2, -1, 0],
            [-1, -2, -3, -4]
          ]
        ],
        2,
        2
      )
    ).to.eql([
      [
        [-1, -2],
        [-1, 0]
      ]
    ]);
  });

  it(`maxPool coordinateMode`, () => {
    expect(
      maxPool(
        [
          [
            [1, 1, 2, 4],
            [5, 6, 7, 8],
            [3, 2, 1, 0],
            [1, 2, 3, 4]
          ]
        ],
        2,
        2,
        true
      )
    ).to.eql([
      [
        [
          { x: 1, y: 1 },
          { x: 3, y: 1 }
        ],
        [
          { x: 0, y: 2 },
          { x: 3, y: 3 }
        ]
      ]
    ]);
  });

  it(`update2Dmatrix`, () => {
    expect(
      update2Dmatrix(
        [
          [1, 1, 1],
          [1, 1, 1]
        ],
        [
          [2, 2, 2],
          [2, 2, 2]
        ],
        0.25
      )
    ).to.eql([
      [1.5, 1.5, 1.5],
      [1.5, 1.5, 1.5]
    ]);

    expect(
      update2Dmatrix(
        [
          [
            [1, 1, 1],
            [1, 1, 1]
          ],
          [
            [1, 1, 1],
            [1, 1, 1]
          ]
        ],
        [
          [
            [2, 2, 2],
            [2, 2, 2]
          ],
          [
            [2, 2, 2],
            [2, 2, 2]
          ]
        ],
        0.25
      )
    ).to.eql([
      [
        [1.5, 1.5, 1.5],
        [1.5, 1.5, 1.5]
      ],
      [
        [1.5, 1.5, 1.5],
        [1.5, 1.5, 1.5]
      ]
    ]);
  });

  it(`flattenDeep`, () => {
    expect(flattenDeep([1, 2, 3, [1, 2, 3, 4, [2, 3, 4]]])).to.eql([
      1,
      2,
      3,
      1,
      2,
      3,
      4,
      2,
      3,
      4
    ]);
  });
  it(`max`, () => {
    expect(max([0, 1, 2, 3])).to.eql(3);
    expect(max([0, -1, -2, -3])).to.eql(0);
    expect(max([[1, 2, 4], 3])).to.eql(4);
    expect(
      max([
        [1, 2, 4],
        [1, 2, [3, 5], [2, 3, [6, 2]]]
      ])
    ).to.eql(6);
  });

  it(`softmax`, () => {
    expect(softmax([1, 1, 1])).to.eql([1 / 3, 1 / 3, 1 / 3]);
    expect(sum(softmax([1, 3, 4, 2, 1, 4]))).to.eql(1);
    expect(
      Math.round(
        sum(
          softmax(
            new Array(parseInt(Math.random() * 10))
              .fill(0)
              .map(() => Math.random() * 3)
          )
        ) * 1000
      ) / 1000
    ).to.eql(1);
  });

  it(`maxIndex`, () => {
    expect(maxIndex([1, 2, 3])).to.eql(2);
    expect(maxIndex([0, 1, 0, 0, 0])).to.eql(1);
  });
});
