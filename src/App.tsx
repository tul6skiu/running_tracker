import { useState, useEffect } from "react";
import "./App.css";

type ActivityEntry = {
  date: string;       // формат "дд.мм.гггг"
  kilometers: string; // произвольный текст
};

function isValidDate(dateStr: string): boolean {
  const regex = /^\d{2}\.\d{2}\.\d{4}$/;
  if (!regex.test(dateStr)) return false;

  const [dayStr, monthStr, yearStr] = dateStr.split(".");
  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);

  if (month < 1 || month > 12) return false;

  const daysInMonth = new Date(year, month, 0).getDate();

  if (day < 1 || day > daysInMonth) return false;

  return true;
}

const App = () => {
  const [date, setDate] = useState("");
  const [kilometers, setKilometers] = useState("");
  const [history, setHistory] = useState<ActivityEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("activityHistory");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveHistory = (newHistory: ActivityEntry[]) => {
    setHistory(newHistory);
    localStorage.setItem("activityHistory", JSON.stringify(newHistory));
  };

  const handleAdd = () => {
    if (!isValidDate(date)) {
      alert("Введите корректную дату в формате дд.мм.гггг");
      return;
    }
    if (!kilometers.trim()) {
      alert("Введите количество километров");
      return;
    }
  
    const newEntry: ActivityEntry = { date, kilometers };
    const newHistory = [...history, newEntry];
  
    newHistory.sort((a, b) => {
      const parseDate = (str: string) => {
        const [day, month, year] = str.split(".").map(Number);
        return new Date(year, month - 1, day);
      };
    
      return parseDate(b.date).getTime() - parseDate(a.date).getTime(); // b - a, чтобы новая дата выше
    });
  
    setHistory(newHistory);
    localStorage.setItem("activityHistory", JSON.stringify(newHistory));
    setDate("");
    setKilometers("");
  };

  const handleDelete = (index: number) => {
    const newHistory = history.filter((_, i) => i !== index);
    saveHistory(newHistory);
  };

  return (
    <div className="activity-form-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleAdd();
        }}
        className="activity-form">
      <div className="activety-content">
      <label>
          Дата:
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="20.07.2019"
            maxLength={10}
            pattern="\d{2}\.\d{2}\.\d{4}"
            title="Введите дату в формате дд.мм.гггг"
            required
          />
        </label>

        <label>
          Километры:
          <input
            type="text"
            value={kilometers}
            onChange={(event) => setKilometers(event.target.value)}
            placeholder="5.4"
            required
          />
        </label>

        <button type="submit" className="add-button">
          Добавить
        </button>
      </div>    
      </form>

      <h3>История активности</h3>
      {history.length === 0 ? (
        <p>Пока нет записей</p>
      ) : (
        <ul className="history-list">
          {history.map((entry, index) => (
            <li key={index}>
              <span className="entry-text">
                {entry.date} 
              </span>
              <span className="entry-text">{entry.kilometers}</span>
              <button className="delete-button" onClick={() => handleDelete(index)}>
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
