
import { useState } from 'react';
import { Tabs, Table } from 'antd';
import './styles.css'

function App() {
  const [proposeFile, setProposeFile] = useState(null)

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
    const proposes = formatProposes(data);
    const groups = groupByDay(proposes, timeInterval)
    // const total_votes = proposes.reduce((acc, current) => acc + current.supports, 0);
    return  orderBySupports(groups)
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
          days.push({ date: day, proposes: [], index: index, totalVotes: 0 });
        }

        days[dayIndex].totalVotes += post.supports;
        days[dayIndex].proposes.push({ ...post, published_at: `${day} ${time}`, key: `${day}${time}-${index}` });
      }
    });
    return days;
  };

  const createTabItems = () => {
    const plenarias = formatData(proposeFile, []);
    return plenarias.map((plenaria) => {
      return {
        key: plenaria.date,
        label: plenaria.date,
        children: 
        <div>
          <h1> Total de votos: {plenaria.totalVotes} </h1>
          <Table
            columns={[
              { dataIndex: "id", key: "id", title: "Código" },
              { dataIndex: "title", key: "title", title: "Nome" },
              { dataIndex: "category", key: "category", title: "Categoria" },
              { dataIndex: "supports", key: "supports", title: "Votos" },
              { dataIndex: "followers", key: "followers", title: "Seguidores" },
              { dataIndex: "comments", key: "comments", title: "Comentários" },
              { dataIndex: "published_at", key: "published_at", title: "Data de publicação" },
            ]}
            dataSource={plenaria.proposes}
          />
        </div>
      }
    }
    )
  }

  const getTabs = () => {
    const plenarias = createTabItems();
    return <Tabs items={plenarias} />
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
        {/* <Upload className='upload-container' accept=".json"
          label="Faça o upload dos registros aqui"
          onChange={handleFileUpload}
          uploadTimeout={() => {
            return new Promise((resolve) => {
              return setTimeout(resolve, 1000)
            })
          }} /> */}

        <form>
          <label>
            Upload JSON:
            <input type="file" accept=".json" onChange={handleFileUpload} />
          </label>
        </form>
        {proposeFile && getTabs()}
      </div>
    </>
  )
}

export default App
