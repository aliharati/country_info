const Filter = ({ value, changeFunction }) => {
  return (
    <div>
      <input value={value} onChange={changeFunction}></input>
    </div>
  );
};

export default Filter;
