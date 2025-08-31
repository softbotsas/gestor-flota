const indexCtrl = {};

indexCtrl.renderIndex = (req, res) => {
  res.render('index', { title: 'Panel Principal' });
};

module.exports = indexCtrl;