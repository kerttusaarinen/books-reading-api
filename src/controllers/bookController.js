exports.getBooks = (req, res) => {
  res.json([
    {
      title: "A court of mist and fury",
      author: "Sarah J Maas",
      status: "finished"
    },
    {
      title: "A court of thrones and roses",
      author: "Sarah J Maas",
      status: "finished"
    }
  ]);
};

exports.postBooks = (req, res) => {
  const { title, author, status } = req.body;

  if (!title || !author || !status) {
    return res.status(400).json({
      error: "title, author and status are required"
    });
  }

  const newBook = {
    title,
    author,
    status
  };

  res.status(201).json(newBook);
};

