{
  const SET_ROWS = Symbol('set-rows');
  const RESET = Symbol('reset');

  const reducer = (state, command) => {
    switch (command.type) {
      case SET_ROWS:
        return {
          rows: [...command.rows.map(row => ({...row}))],
        };
      case RESET:
        return {
          rows: [],
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
    reset: () => ({
      type: RESET,
    }),
  };

  class Table extends opr.Toolkit.Root {

    static get defaultProps() {
      return {
        rows: [],
      }
    }

    getReducers() {
      return [reducer];
    }

    getTableBody() {
      if (!this.props.rows || this.props.rows.length === 0) {
        return null;
      }
      return [
        'tbody',
        ...this.props.rows.map(
            row =>
                ['tr', {
                  key: row.id,
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
                 ]]),
      ];
    }

    render() {
      return [
        'table',
        {
          class: 'table table-hover table-striped test-data',
        },
        this.getTableBody(),
      ];
    }
  }

  loader.define('table', Table);
}

opr.Toolkit.configure({
  debug: true,
  level: 'debug',
});
