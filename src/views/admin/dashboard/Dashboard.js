import { Chart } from 'react-google-charts';
import { Paper, Typography } from '@material-ui/core';
import Alert from 'inc/Alert';
import Api from 'inc/Apiv2';
import Button from 'widgets/sanna/Button';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import clsx from 'clsx';
import history from '@history';
import ModalRotationMedications from './widgets/ModalRotationMedications';
import moment from 'moment';
import PageWrapper from 'app/fuse-layouts/layout1/components/PageWrapper';
import Ranger from 'widgets/sanna/fields/Ranger';
import React from 'react';
import Select from 'widgets/sanna/Select';
import useAuthUser from 'hooks/auth-user';
import VsPreviousDay from './widgets/VsPreviousDay';
import WError from 'widgets/WError';
import WLoading from 'widgets/WLoading';

const DEFAULT_FIL = Object.freeze({
  selected: {
    date_from: new Date(),
    date_to: new Date(),
    campus: null,
    client: null,
    consultation_type: null,
  },
  query: {
    date_from: null,
    date_to: null,
    campus_id: null,
    client_id: null,
    consultation_type_id: null,
  },
});

const COLORS = [
  '#A2F2D4',
  '#A6B3FF',
  '#ACEAF3',
  '#FFD9E0',
  '#D4FEDD',
  '#EEEEEE',
  '#65a5d8',
  '#a4fcdd',
  '#edf481',
  '#ffcccc',
  '#ffb2ba',
  '#f3f995',
  '#9df9de',
  '#f28ac6',
  '#aff285',
  '#7af4e8',
  '#8eb6f2',
  '#8befac',
  '#7ced6d',
  '#e2f98b',
  '#8def75',
  '#f4779d',
  '#9ffce1',
  '#f4709a',
  '#aefcef',
  '#e3ccff',
];

export const getChartColumnLabels = (text, length = 20) => {
  const name = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  const shortName = name.substring(0, length) + '...';
  return { name, shortName };
};

const Dashboard = props => {
  const [fil, setFil] = React.useState(DEFAULT_FIL);
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const authUser = useAuthUser();
  const [modalOpened, setModalOpened] = React.useState(false);
  const [dropdowns, setDropdowns] = React.useState({
    consultationTypes: [],
    clients: [],
    campus: [],
  });

  React.useEffect(() => {
    loadData();
  }, [JSON.stringify(fil.query)]);

  React.useEffect(() => {
    loadDropdownsInit();
  }, []);

  React.useEffect(() => {
    loadDropdownCampus(fil.query.client_id);
  }, [fil.query.client_id]);

  const loadData = async () => {
    setLoading(true);
    const response = await Api.get('/dashboard', fil.query);

    if (!response.ok) {
      setLoading(false);
      setError(response.message);
    }

    setData(response.data);
    setError(null);
    setLoading(false);
  };

  const getRotationMedications = () => {
    let items = [
      [
        'Element',
        'Cantidad',
        { role: 'style' },
        {
          role: 'annotation',
        },
        { role: 'tooltip', type: 'string', p: { html: true } },
      ],
    ];

    data.rotationMedications.forEach((i, idx) => {
      const labels = getChartColumnLabels(i.name);
      items.push([labels.shortName, i.count, COLORS[idx], i.count.toString(), labels.name]);
    });

    if (items.length === 1) {
      items.push(['Sin datos', 0, '#b87333', 'N/A', 'N/A']);
    }

    return items;
  };

  const getConsultationsByPatientProfile = () => {
    let items = [
      [
        'Element',
        'Cantidad',
        { role: 'style' },
        {
          sourceColumn: 0,
          role: 'annotation',
          type: 'string',
          calc: 'stringify',
        },
      ],
    ];

    data.consultationsByPatientProfile.forEach((i, idx) => {
      items.push([i.name, i.count, COLORS[idx], i.count.toString()]);
    });

    if (items.length === 1) {
      items.push(['Sin datos', 0, '#b87333', 'N/A']);
    }

    return items;
  };

  const getConsultationsByBiologicalSystem = () => {
    let items = [
      [
        'Element',
        'Cantidad',
        { role: 'style' },
        {
          sourceColumn: 0,
          role: 'annotation',
          type: 'string',
          calc: 'stringify',
        },
      ],
    ];

    data.consultationsByBiologicalSystem.forEach((i, idx) => {
      items.push([i.name, i.count, COLORS[idx], i.count.toString()]);
    });

    if (items.length === 1) {
      items.push(['Sin datos', 0, '#b87333', 'N/A']);
    }

    return items;
  };

  const getConsultationsPerDay = () => {
    let items = [
      [
        'Element',
        'Cantidad',
        { role: 'style' },
        {
          sourceColumn: 0,
          role: 'annotation',
          type: 'string',
          calc: 'stringify',
        },
      ],
    ];

    data.consultationsPerDay.forEach(i => {
      items.push([i.attendance_date, i.count, null, i.count.toString()]);
    });

    if (items.length === 1) {
      items.push(['Sin datos', 0, '#b87333', 'N/A']);
    }

    return items;
  };

  const getEpidemiologicalProfile = () => {
    let items = [
      [
        'Element',
        'Cantidad',
        { role: 'style' },
        {
          role: 'annotation',
        },
        { role: 'tooltip', type: 'string', p: { html: true } },
      ],
    ];

    data.epidemiologicalProfile.forEach((i, idx) => {
      const labels = getChartColumnLabels(i.name, 25);
      items.push([labels.shortName, i.count, COLORS[idx], i.count.toString(), labels.name]);
    });

    if (items.length === 1) {
      items.push(['Sin datos', 0, '#b87333', 'N/A', 'N/A']);
    }

    return items;
  };

  const loadDropdownsInit = async () => {
    let clients = [];
    let campus = [];
    let consultationTypes = [];

    const [consultationTypesRsp, clientsRsp] = await Promise.all([
      Api.get('/dropdown-options/consultation-types'),
      Api.get(`/dropdown-options/users/${authUser.data.id}/assignments/clients`, { limit: 1000 }),
    ]);

    if (!consultationTypesRsp.ok) return Alert.error(consultationTypesRsp.message);
    consultationTypes = consultationTypesRsp.data;

    if (!clientsRsp.ok) return Alert.error(clientsRsp.message);
    clients = clientsRsp.data;

    if (clients.length === 1) {
      const campusRsp = await Api.get(`/dropdown-options/users/${authUser.data.id}/assignments/campus`, {
        client_id: clients[0].id,
        limit: 1000,
      });
      if (!campusRsp.ok) return Alert.error(campusRsp.message);

      campus = campusRsp.data;
    }

    setDropdowns({
      consultationTypes,
      campus,
      clients,
    });
  };

  const loadDropdownCampus = async () => {
    if (!fil.query.client_id) return;

    const campusRsp = await Api.get(`/dropdown-options/users/${authUser.data.id}/assignments/campus`, {
      client_id: fil.query.client_id,
      limit: 1000,
    });
    if (!campusRsp.ok) return Alert.error(campusRsp.message);

    setDropdowns(prevState => ({
      ...prevState,
      campus: campusRsp.data,
    }));
  };

  if (loading) return <WLoading />;

  if (error)
    return (
      <WError
        error={error}
        onRetry={() => window.location.reload()}
      />
    );

  return (
    <PageWrapper>
      <div className="flex gap-16 mb-20 relative z-10">
        {dropdowns.clients.length > 1 && (
          <Select
            isClearable
            placeholder="Todos los centros de estudio"
            options={dropdowns.clients}
            value={fil.selected.client}
            onChange={o => {
              setLoading(true);
              setDropdowns(prevState => ({
                ...prevState,
                campus: [],
              }));
              setFil(prevFil => ({
                selected: {
                  ...prevFil.selected,
                  client: o,
                  campus: null,
                },
                query: {
                  ...prevFil.query,
                  client_id: o ? o.id : 0,
                  campus_id: 0,
                },
              }));
            }}
          />
        )}

        {!(dropdowns.clients.length <= 1 && dropdowns.campus.length <= 1) && (
          <Select
            isClearable
            placeholder="Todas las sedes"
            options={dropdowns.campus}
            width="250px"
            value={fil.selected.campus}
            onChange={o => {
              setLoading(true);
              setFil(prevFil => ({
                selected: {
                  ...prevFil.selected,
                  campus: o,
                },
                query: {
                  ...prevFil.query,
                  campus_id: o ? o.id : 0,
                },
              }));
            }}
          />
        )}

        <Select
          isClearable
          placeholder="Todas las consultas"
          options={dropdowns.consultationTypes}
          width="250px"
          value={fil.selected.consultation_type}
          onChange={o => {
            setLoading(true);
            setFil(prevFil => ({
              selected: {
                ...prevFil.selected,
                consultation_type: o || null,
              },
              query: {
                ...prevFil.query,
                consultation_type_id: o ? o.id : 0,
              },
            }));
          }}
        />

        <Ranger
          dateFrom={fil.selected.date_from}
          dateTo={fil.selected.date_to}
          onChange={(date_from, date_to) => {
            if (!date_from || !date_to) {
              date_from = null;
              date_to = null;
            }

            setLoading(true);
            setFil(prevFil => ({
              selected: {
                ...prevFil.selected,
                date_from: date_from,
                date_to: date_to,
              },
              query: {
                ...prevFil.query,
                date_from: date_from ? moment(date_from).format('YYYY-MM-DD') : null,
                date_to: date_to ? moment(date_to).format('YYYY-MM-DD') : null,
              },
            }));
          }}
        />
      </div>

      <div className="flex flex-col gap-16">
        <div className="flex gap-16">
          <Paper
            className="p-16 flex-1 rounded-8"
            elevation={0}
          >
            <Typography
              variant="h6"
              className="font-medium text-16"
            >
              Tópicos aperturados
            </Typography>
            <div
              className={clsx(
                'flex items-center',
                data.topicsOpened.opens < data.topicsOpened.total ? 'text-muired' : 'text-muiprimary',
              )}
            >
              <span className="text-28 font-semibold font-stagsans mr-8">
                {data.topicsOpened.opens} de {data.topicsOpened.total}
              </span>{' '}
              <CheckCircleOutlineIcon style={{ fontSize: 20 }} />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => history.push('/topic-managments')}
                color="secondary"
                variant="text"
                endIcon={<ChevronRightIcon />}
              >
                Ver más
              </Button>
            </div>
          </Paper>

          <VsPreviousDay
            title="Personas atendidas"
            value={data.attendedPersons.total}
            percentage={data.attendedPersons.percentageVsPreviousDay}
          />

          <VsPreviousDay
            style={{ backgroundColor: '#E9EEFF' }}
            title="Consultas estándar"
            value={data.standardConsultations.total}
            percentage={data.standardConsultations.percentageVsPreviousDay}
          />

          <VsPreviousDay
            className="bg-muired-light"
            title="Emergencia"
            value={data.emergencyConsultations.total}
            percentage={data.emergencyConsultations.percentageVsPreviousDay}
          />

          <VsPreviousDay
            className="bg-muiprimary-light"
            title="Consultas - Salud mental"
            value={data.mentalHealthConsultations.total}
            percentage={data.mentalHealthConsultations.percentageVsPreviousDay}
          />
        </div>

        <div className="grid gap-16 grid-cols-12">
          <Paper
            className="p-16 col-span-4 rounded-8"
            elevation={0}
          >
            <Typography
              variant="h6"
              className="font-medium text-16"
              style={{ position: 'relative', marginBottom: -30, zIndex: 1 }}
            >
              Top 5 medicamentos con alta rotación
            </Typography>
            <Chart
              chartType="BarChart"
              width="100%"
              height="250px"
              data={getRotationMedications()}
              options={{
                chartArea: { left: '40%', width: '50%' },
                // width: 600,
                // height: 280,
                bar: { groupWidth: '70%' },
                legend: { position: 'none' },
                annotations: {
                  alwaysOutside: true,
                },
                tooltip: { isHtml: true },
              }}
            />
            <div
              className="flex justify-end"
              style={{ marginTop: -16 }}
            >
              <Button
                disabled={modalOpened}
                onClick={() => setModalOpened(true)}
                className="py-0"
                color="secondary"
                variant="text"
                endIcon={<ChevronRightIcon />}
              >
                Ver todo
              </Button>
            </div>
          </Paper>

          <Paper
            className="p-16 col-span-4 rounded-8"
            elevation={0}
            style={{ flexGrow: 33, flexShrink: 0, flexBasis: '0' }}
          >
            <Typography
              variant="h6"
              className="font-medium text-16"
              style={{ position: 'relative', marginBottom: -30, zIndex: 1 }}
            >
              Atención por perfil
            </Typography>
            <Chart
              chartType="BarChart"
              width="100%"
              height="250px"
              data={getConsultationsByPatientProfile()}
              options={{
                // title: 'Atención por perfil',
                chartArea: { left: '25%', width: '70%' },
                // width: 600,
                // height: 280,
                bar: { groupWidth: '70%' },
                legend: { position: 'none' },
                annotations: {
                  alwaysOutside: true,
                },
              }}
            />
          </Paper>

          <Paper
            className="p-16 col-span-4 rounded-8"
            elevation={0}
            style={{ flexGrow: 33, flexShrink: 0, flexBasis: '0' }}
          >
            <Typography
              variant="h6"
              className="font-medium text-16"
              style={{ position: 'relative', marginBottom: -30, zIndex: 1 }}
            >
              Atenciones por sistema
            </Typography>
            <Chart
              chartType="BarChart"
              width="100%"
              height="250px"
              data={getConsultationsByBiologicalSystem()}
              options={{
                chartArea: { left: '30%', width: '60%' },
                // width: 600,
                // height: 280,
                bar: { groupWidth: '70%' },
                legend: { position: 'none' },
                annotations: {
                  alwaysOutside: true,
                },
              }}
            />
          </Paper>
        </div>
        <div className="grid gap-16 grid-cols-12">
          <Paper
            className="p-16 col-span-8 rounded-8"
            elevation={0}
          >
            <Typography
              variant="h6"
              className="font-medium text-16"
              style={{ position: 'relative', marginBottom: -20, zIndex: 1 }}
            >
              Atenciones por día
            </Typography>
            <Chart
              chartType="LineChart"
              width="100%"
              // height="250px"
              data={getConsultationsPerDay()}
              options={{
                curveType: 'function',
                legend: { position: 'none' },
                annotations: {
                  alwaysOutside: true,
                },
              }}
            />
          </Paper>

          <Paper
            className="p-16 col-span-4 rounded-8"
            elevation={0}
          >
            <Typography
              variant="h6"
              className="font-medium text-16"
              style={{ position: 'relative', marginBottom: -20, zIndex: 1 }}
            >
              Perfil epidemiológico
            </Typography>
            <Chart
              chartType="BarChart"
              width="100%"
              // height="250px"
              data={getEpidemiologicalProfile()}
              options={{
                chartArea: { left: '40%', width: '50%' },
                // width: 600,
                // height: 280,
                bar: { groupWidth: '70%' },
                legend: { position: 'none' },
                annotations: {
                  alwaysOutside: true,
                },
                tooltip: { isHtml: true },
              }}
            />
          </Paper>
        </div>
      </div>
      <ModalRotationMedications
        open={modalOpened}
        fil={fil.query}
        onOk={() => setModalOpened(false)}
      />
    </PageWrapper>
  );
};

Dashboard.propTypes = {};

export default Dashboard;
