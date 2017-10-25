{
  const SET_ROWS = Symbol('set-rows');
  const SELECT_ROW = Symbol('select-row');
  const DELETE_ROW = Symbol('delete-row');

  const reducer = (state, command) => {
    switch (command.type) {
      case SET_ROWS:
        return {
          ...state,
          rows: [...command.rows.map(row => ({...row}))],
          selected: -1,
        };
      case SELECT_ROW:
        return {
          ...state,
          selected: command.index,
        };
      default:
        return state;
    }
  };

  reducer.commands = {
    setRows: rows => ({
      type: SET_ROWS,
      rows,
    }),
    selectRow: index => ({
      type: SELECT_ROW,
      index,
    }),
  };

  const Row = Symbol.for('table-row');

  class Table extends opr.Toolkit.Root {

    static get defaultProps() {
      return {
        rows: [],
      };
    }

    getReducers() {
      return [reducer];
    }

    getRow(row, index) {
      return [
        'tr', {
          key: row.id,
          metadata: {
            data_id: row.id,
          },
          class: this.props.selected === index ? 'danger' : null,
        },
        [
          'td',
          {
            class: 'col-md-1',
          },
          String(row.id),
        ],
        [
          'td',
          {
            class: 'col-md-4',
          },
          [
            'a',
            {
              class: 'lbl',
            },
            row.label,
          ],
        ],
        [
          'td',
          {
            class: 'col-md-1',
          },
          [
            'a',
            {
              class: 'remove',
            },
            [
              'span',
              {
                class: 'glyphicon glyphicon-remove remove',
              },
            ],
          ],
        ],
        [
          'td',
          {
            class: 'col-md-6',
          },
        ]
      ];
    }

    render() {
      return [
        'table',
        {
          class: 'table table-hover table-striped test-data',
        },
        [
          'tbody',
          ...this.props.rows.map(this.getRow),
        ],
      ];
    }
  }

  loader.define('table', Table);
}

opr.Toolkit.configure({
  debug: true,
  level: 'info',
});

// render
// render = row =>
//     ['tr', {
//       key: row.id,
//     },
//      [
//        'td',
//        {
//          class: 'col-md-1',
//        },
//        String(row.id),
//      ],
//      [
//        'td',
//        {
//          class: 'col-md-4',
//        },
//        [
//          'a',
//          {
//            class: 'lbl',
//          },
//          row.label,
//        ],
//      ],
//      [
//        'td',
//        {
//          class: 'col-md-1',
//        },
//        [
//          'a',
//          {
//            class: 'remove',
//          },
//          [
//            'span',
//            {
//              class: 'glyphicon glyphicon-remove remove',
//            },
//          ],
//        ],
//      ],
//      [
//        'td',
//        {
//          class: 'col-md-6',
//        },
//      ]]

// console.time('deep equal');
// for (let i = 0; i < 100000; i++) {
//   opr.Toolkit.Diff.deepEqual(
//       render({
//         id: 10,
//         label: 'label',
//       }),
//       render({
//         id: 10,
//         label: 'label',
//       }));
// }
// console.timeEnd('deep equal');

// console.time('describe');
// for (let i = 0; i < 100000; i++) {
//   opr.Toolkit.Template.describe(render({
//     id: 10,
//     label: 'label',
//   }));
// }
// console.timeEnd('describe');