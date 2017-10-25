{
  const SET_ROWS = Symbol('set-rows');
  const SELECT_ROW = Symbol('select-row');
  const DELETE_ROW = Symbol('delete-row');

  const reducer = (state, command) => {
    switch (command.type) {
      case SET_ROWS:
        return {
          ...state,
          rows: [...command.rows.map(row => ({id: row.id, label: row.label}))],
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

  class TableRow extends opr.Toolkit.Component {

    render() {
      let className = null;
      if (this.props.selected) {
        className = 'danger';
      }
      return [
        'tr', {
          key: this.props.id,
          metadata: {
            data_id: this.props.id,
          },
          class: className,
        },
        [
          'td',
          {
            class: 'col-md-1',
          },
          String(this.props.id),
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
            this.props.label,
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
  }

  loader.define('table-row', TableRow);

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
      return this.createRow({
        id: row.id,
        label: row.label,
        selected: this.props.selected === index,
        index,
      })
    }

    createRow(data) {
      let className = null;
      if (data.selected) {
        className = 'danger';
      }
      return [
        'tr', {
          key: data.id,
          metadata: {
            data_id: data.id,
          },
          origin: data,
          class: className,
        },
        [
          'td',
          {
            class: 'col-md-1',
          },
          String(data.id),
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
            data.label,
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
          'tbody', ...this.props.rows.map(this.getRow),
          //           ...this.props.rows.map((row, index) => [
          //             Row, {
          //               key: row.id,
          //               id: row.id,
          //               label: row.label,
          //               selected: index === this.props.selected,
          //             },
          //           ])
        ],
      ];
    }
  }

  loader.define('table', Table);
}

opr.Toolkit.configure({
  debug: false,
  level: 'info',
});
