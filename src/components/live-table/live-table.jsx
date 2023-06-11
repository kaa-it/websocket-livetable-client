import './live-table.css';

const LiveTable = (props) => {
  const { table } = props;
  return (
    <table className="live-table">
      <thead>
        <tr>
          <th className="live-table__cell live-table__cell--first-column">
            id
          </th>
          <th className="live-table__cell">text</th>
        </tr>
      </thead>
      <tbody>
        {table.map((row) => {
          return (
            <tr key={row.id.toString()}>
              <td className="live-table__cell live-table__cell--first-column">
                {row.id}
              </td>
              <td className="live-table__cell">{row.text}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default LiveTable;
