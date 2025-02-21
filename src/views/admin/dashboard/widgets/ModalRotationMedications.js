import { getChartColumnLabels } from '../Dashboard';
import { Typography } from '@material-ui/core';
import Alert from 'inc/Alert';
import Api from 'inc/Apiv2';
import Button from 'widgets/sanna/Button';
import Chart from 'react-google-charts';
import Modal from 'widgets/sanna/Modal';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';
import React from 'react';

const ModalRotationMedications = props => {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (props.open) loadData();
  }, [props.open]);

  const loadData = async () => {
    setLoading(true);
    const response = await Api.get('/dashboard/rotation-medications', props.fil);
    if (!response.ok) {
      setLoading(false);
      return Alert.error(response.message);
    }

    setLoading(false);
    setItems(getItemsToChart(response.data));
  };

  const getItemsToChart = items => {
    let charItems = items.map(i => {
      const labels = getChartColumnLabels(i.name);
      const color = randomColor({ luminosity: 'light' });

      return [labels.shortName, i.count, color, i.count.toString(), labels.name];
    });

    if (!charItems.length) {
      charItems.push(['Sin datos', 0, '#b87333', 'N/A', 'N/A']);
    }

    charItems.unshift([
      'Element',
      'Cantidad',
      { role: 'style' },
      {
        role: 'annotation',
      },
      { role: 'tooltip', type: 'string', p: { html: true } },
    ]);

    return charItems;
  };

  const calcChartHeight = () => {
    let height = 100;

    if (items.length === 2) return height;
    height = 0;

    const ceilVal = Math.ceil((items.length - 1) / 25);
    Array(ceilVal)
      .fill(1)
      .forEach(() => {
        height += 500;
      });

    return height;
  };

  if (loading) return null;

  return (
    <Modal
      open={props.open}
      stylePaper={{ width: 600 }}
    >
      <Typography
        variant="h6"
        className="font-medium text-16 mb-16"
      >
        Top 5 medicamentos con alta rotación
      </Typography>
      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
        <Chart
          chartType="BarChart"
          width="98%"
          height={calcChartHeight()}
          data={items}
          options={{
            chartArea: { left: '45%', width: '50%', height: '100%' },
            bar: { groupWidth: '70%' },
            legend: { position: 'none' },
            vAxis: {
              textStyle: {
                fontSize: 11,
              },
            },
            annotations: {
              alwaysOutside: true,
              textStyle: {
                fontSize: 12,
              },
            },
            tooltip: { isHtml: true },
          }}
        />
      </div>
      <Button
        className="mt-16"
        fullWidth
        onClick={props.onOk}
      >
        Entendido
      </Button>
    </Modal>
  );
};

ModalRotationMedications.propTypes = {
  onOk: PropTypes.func,
  open: PropTypes.bool,
  fil: PropTypes.object.isRequired,
  getTopRotationMedications: PropTypes.func,
};

export default ModalRotationMedications;
