
import './styles.css'
import final from './mocks/final.json'
import { useState } from 'react';

function App() {
  const [proposeFile, setProposeFile] = useState([]);

  const timeInterval = [
    {
      initial: "2023-04-18 09:00:00",
      final: "2023-04-18 14:00:00"
    },
    {
      initial: "2023-05-02 11:00:11",
      final: "2023-05-03 01:00:36"
    },
  ];

  const formatProposes = (proposes) => {
    return proposes.map(propose => ({
      id: propose.id,
      title: propose.title['pt-BR'],
      category: propose.category.name['pt-BR'],
      supports: propose.supports,
      followers: propose.followers,
      comments: propose.comments,
      published_at: propose.published_at,
      url: propose.url,
    }))
  }

  const orderBySupports = (days) => {
    return days.map(day => {
      return { ...day, proposes: day.proposes.sort((a, b) => b.supports - a.supports) }
    })
  }

  const formatData = (data, timeInterval) => {
    const proposes = formatProposes(data)
    const groups = groupByDay(proposes, timeInterval)
    return orderBySupports(groups)
  }

  const groupByDay = (posts, timeIntervals = []) => {
    const days = [];


    posts.forEach((post, index) => {
      const publishedAt = new Date(post.published_at);

      if (timeIntervals.length === 0 || timeIntervals.some(({ initial, final }) => publishedAt >= new Date(initial) && publishedAt <= new Date(final))) {
        const day = publishedAt.toLocaleDateString('pt-BR');
        const time = publishedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

        let dayIndex = days.findIndex(d => d.date === day);

        if (dayIndex === -1) {
          dayIndex = days.length;
          days.push({ date: day, proposes: [], index: index });
        }

        days[dayIndex].proposes.push({ ...post, published_at: `${day} ${time}` });
      }
    });

    return days;
  };

  const getTab = () => {
    const plenarias = formatData(proposeFile, timeInterval);
    return (plenarias && plenarias.length && <Tab className="false">
      {plenarias.map((plenaria) =>
        <Tab.Content className="false" key={'tab_' + plenaria.index} title={plenaria.date}>
          <Table
            className="false"
            headers={[
              { field: "id", label: "Código" },
              { field: "title", label: "Nome" },
              { field: "category", label: "Categoria" },
              { field: "supports", label: "Votos" },
              { field: "followers", label: "Seguidores" },
              { field: "comments", label: "Comentários" },
              { field: "published_at", label: "Data de publicação" },
            ]}
            data={plenaria.proposes}
          />
        </Tab.Content>
      )}
    </Tab>)
  }
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target.result;
      setProposeFile(JSON.parse(content));
    };

    reader.readAsText(file);
  };

  return (
    <>
      <div className='tab-container'>
        <Upload className='upload-container' accept=".json"
          label="Faça o upload dos registros aqui"
          onChange={handleFileUpload}
          uploadTimeout={() => {
            return new Promise((resolve) => {
              return setTimeout(resolve, 1000)
            })
          }} />
        {getTab()}
      </div>
    </>
  )
}

export default App
