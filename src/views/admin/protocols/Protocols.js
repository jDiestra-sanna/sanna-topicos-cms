import { Icon, IconButton, InputBase, Paper, Typography, makeStyles } from '@material-ui/core';
import AccordionProtocol from 'widgets/sanna/AccordionProtocol';
import AddIcon from '@material-ui/icons/Add';
import Button from 'widgets/sanna/Button';
import PageWrapper from 'app/fuse-layouts/layout1/components/PageWrapper';
import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import Api from 'inc/Apiv2';
import Alert from 'inc/Alert';
import ProtocolType from 'models/protocol-types';
import history from '@history';
import clsx from 'clsx';
import AccordionProtocolStekeleton from 'widgets/sanna/AccordionProtocolStekeleton';
import useAuthUser from 'hooks/auth-user';
import useLocalStorage, { Keys } from 'hooks/useLocalStorage';

const useStyles = makeStyles(theme => ({
  searcherPaper: { maxWidth: '300px', width: '100%', display: 'flex' },
  searcherInput: { padding: '6px 16px', flex: 1 },
  buttonTabEmpty: { padding: '6px 26px', cursor: 'pointer', userSelect: 'none' },
}));

const NO_RESULT_STATUS = {
  INIT: '[INIT]',
  SHOWING: '[SHOWING]',
  HIDING: '[HIDING]',
};

function Protocols(props) {
  const [attendance, _] = useLocalStorage(Keys.ATTENDANCE);
  const authUser = useAuthUser();
  const [protocols, setProtocols] = React.useState([]);
  const [clients, setClientes] = React.useState([]);
  const [protocolTypeId, setProtocolTypeId] = React.useState(ProtocolType.SANNA_ID);
  const classes = useStyles(props);
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [noResultData, setNoResultData] = React.useState({
    query: '',
    status: NO_RESULT_STATUS.INIT,
  });

  React.useEffect(() => {
    loadData();
  }, [protocolTypeId, JSON.stringify(attendance)]);

  React.useEffect(() => {
    if (noResultData.status === NO_RESULT_STATUS.HIDING) {
      setNoResultData({
        query: '',
        status: NO_RESULT_STATUS.INIT,
      });
      loadData();
    }
  }, [JSON.stringify(noResultData)]);

  async function removeProtocolFile(protocolIndex, protocolFileId) {
    const protocol = protocols[protocolIndex];

    const response = await Api.delete(`/protocols/${protocol.id}/protocol-files/${protocolFileId}`);
    if (!response.ok) return Alert.error(response.message);

    setProtocols(prevState =>
      prevState.map((protocol, _index) => {
        if (_index !== protocolIndex || !Array.isArray(protocol.protocol_files)) return protocol;

        return {
          ...protocol,
          protocol_files: protocol.protocol_files.filter(protocol_file => protocol_file.id !== protocolFileId),
        };
      }),
    );
  }

  async function removeSubprotocolFile(protocolIndexParam, subProtocolIndexParam, protocolFileId) {
    const protocol = protocols[protocolIndexParam];
    if (!protocol) throw new Error(`Protocol not found, index: ${protocolIndexParam}`);

    const subprotocol = protocol.subprotocols[subProtocolIndexParam];
    if (!subprotocol) throw new Error(`Subprotocol not found, index: ${subProtocolIndexParam}`);

    const response = await Api.delete(
      `/protocols/${protocol.id}/subprotocols/${subprotocol.id}/subprotocol-files/${protocolFileId}`,
    );
    if (!response.ok) return Alert.error(response.message);

    setProtocols(prevState =>
      prevState.map((protocol, protocolIndex) => {
        if (protocolIndex !== protocolIndexParam || !Array.isArray(protocol.protocol_files)) return protocol;

        const subprotocols = protocol.subprotocols.map((subprotocol, subprotocolIndex) => {
          if (subprotocolIndex !== subProtocolIndexParam) return subprotocol;

          return {
            ...subprotocol,
            subprotocol_files: subprotocol.subprotocol_files.filter(
              protocol_file => protocol_file.id !== protocolFileId,
            ),
          };
        });

        return {
          ...protocol,
          subprotocols,
        };
      }),
    );
  }

  async function addProtocolFile(index, filedata) {
    const protocol = protocols[index];
    const isEditing = filedata.rowIndex !== null;
    let response;

    if (isEditing) {
      const protocolFile = protocol.protocol_files[filedata.rowIndex];
      response = await Api.patch(`/protocols/${protocol.id}/protocol-files/${protocolFile.id}`, {
        file_id: filedata.id,
      });
    } else {
      response = await Api.post(`/protocols/${protocol.id}/protocol-files`, { file_id: filedata.id });
    }

    if (!response.ok) return Alert.error(response.message);

    let protocol_files;

    if (isEditing) {
      protocol_files = protocol.protocol_files.map((protocol_file, _index) => {
        if (_index !== filedata.rowIndex) return protocol_file;
        return {
          ...protocol_file,
          file: filedata,
          file_id: filedata.id,
          onDownload: () => Api.download(`/files/${filedata.id}/download`),
          onDelete: () => removeProtocolFile(index, filedata.id),
        };
      });
    } else {
      protocol_files = [
        ...(protocol.protocol_files || []),
        {
          id: response.data,
          file: filedata,
          file_id: filedata.id,
          onDownload: () => Api.download(`/files/${filedata.id}/download`),
          onDelete: () => removeProtocolFile(index, filedata.id),
        },
      ];
    }

    setProtocols(prevState =>
      prevState.map((protocol, _index) => {
        if (_index !== index) return protocol;

        return {
          ...protocol,
          protocol_files,
        };
      }),
    );
  }

  async function addSubprotocolFile(protocolIndexParam, subProtocolIndexParam, filedata) {
    const protocol = protocols[protocolIndexParam];
    if (!protocol) throw new Error(`Protocol not found, index: ${protocolIndexParam}`);

    const subprotocol = protocol.subprotocols[subProtocolIndexParam];
    if (!subprotocol) throw new Error(`Subprotocol not found, index: ${subProtocolIndexParam}`);

    const isEditing = filedata.rowIndex !== null;
    let response;

    if (isEditing) {
      const subprotocolFile = subprotocol.subprotocol_files[filedata.rowIndex];
      response = await Api.patch(
        `/protocols/${protocol.id}/subprotocols/${subprotocol.id}/subprotocol-files/${subprotocolFile.id}`,
        {
          file_id: filedata.id,
        },
      );
    } else {
      response = await Api.post(`/protocols/${protocol.id}/subprotocols/${subprotocol.id}/subprotocol-files`, {
        file_id: filedata.id,
      });
    }

    if (!response.ok) return Alert.error(response.message);

    let subprotocol_files;

    if (isEditing) {
      subprotocol_files = subprotocol.subprotocol_files.map((protocol_file, _index) => {
        if (_index !== filedata.rowIndex) return protocol_file;

        return {
          ...protocol_file,
          file: filedata,
          file_id: filedata.id,
          onDownload: () => Api.download(`/files/${filedata.id}/download`),
          onDelete: () => removeProtocolFile(protocolIndexParam, filedata.id),
        };
      });
    } else {
      subprotocol_files = [
        ...subprotocol.subprotocol_files,
        {
          id: response.data,
          file: filedata,
          file_id: filedata.id,
          onDownload: () => Api.download(`/files/${filedata.id}/download`),
          onDelete: () => removeProtocolFile(protocolIndexParam, filedata.id),
        },
      ];
    }

    setProtocols(prevState => {
      return prevState.map((protocol, _index) => {
        if (_index !== protocolIndexParam) return protocol;

        const subprotocols = protocol.subprotocols.map((__subprotocol, __index) => {
          if (__index !== subProtocolIndexParam) return __subprotocol;

          return {
            ...__subprotocol,
            subprotocol_files,
          };
        });

        return {
          ...protocol,
          subprotocols,
        };
      });
    });
  }

  function addProtocol(protocol_type_id, client_id = 0) {
    let defaultProtocol = {
      id: false,
      title: '',
      description: '',
      creating: true,
      editing: false,
      expanded: false,
      protocol_files: [],
      subprotocols: [],
      protocol_type_id,
    };

    if (protocol_type_id === ProtocolType.CLIENT_ID) {
      defaultProtocol.client_id = client_id;
    }

    setProtocols(prevState => [...prevState, defaultProtocol]);
  }

  function addSubProtocol(protocolIndex) {
    let defaultProtocol = {
      id: false,
      title: '',
      description: '',
      creating: true,
      editing: false,
      expanded: false,
      subprotocol_files: [],
    };

    setProtocols(prevState =>
      prevState.map((protocol, index) => {
        if (index !== protocolIndex) return protocol;
        return {
          ...protocol,
          subprotocols: [...(protocol.subprotocols || []), defaultProtocol],
        };
      }),
    );
  }

  async function saveProtocol(protocolIndex) {
    const protocol = protocols[protocolIndex];
    const data = {
      title: protocol.title,
      protocol_type_id: protocol.protocol_type_id,
      description: protocol.description,
    };

    if (protocol.protocol_type_id === ProtocolType.CLIENT_ID) {
      data.client_id = protocol.client_id;
    }

    let response;

    if (typeof protocol.id === 'number') {
      response = await Api.patch(`/protocols/${protocol.id}`, data);
    } else {
      response = await Api.post('/protocols', data);
    }

    if (!response.ok) return Alert.error(response.message);

    if (typeof protocol.id !== 'number') changePropValue(protocolIndex, 'id', response.data);
    changePropValue(protocolIndex, 'creating', false);
    changePropValue(protocolIndex, 'editing', false);
  }

  async function saveSubprotocol(protocolIndex, subprotocolIndex) {
    const protocol = protocols[protocolIndex];
    if (!protocol) throw new Error(`Protocol not found, index: ${protocolIndex}`);

    const subprotocol = protocol.subprotocols[subprotocolIndex];
    if (!subprotocol) throw new Error(`Subprotocol not found, index: ${subprotocolIndex}`);

    const data = {
      title: subprotocol.title,
      description: subprotocol.description,
    };

    let response;

    if (typeof subprotocol.id === 'number') {
      response = await Api.patch(`/protocols/${protocol.id}/subprotocols/${subprotocol.id}`, data);
    } else {
      response = await Api.post(`/protocols/${protocol.id}/subprotocols`, data);
    }

    if (!response.ok) return Alert.error(response.message);

    if (typeof subprotocol.id !== 'number') changePropValue(protocolIndex, 'id', response.data, subprotocolIndex);
    changePropValue(protocolIndex, 'creating', false, subprotocolIndex);
    changePropValue(protocolIndex, 'editing', false, subprotocolIndex);
  }

  async function removeProtocol(protocolIndex) {
    const protocol = protocols[protocolIndex];

    if (typeof protocol.id === 'number') {
      const response = await Api.delete(`/protocols/${protocol.id}`);
      if (!response.ok) return Alert.error(response.message);
      setProtocols(prevState => prevState.filter((_, index) => index != protocolIndex));
    } else {
      setProtocols(prevState => prevState.filter((_, index) => index != protocolIndex));
    }
  }

  async function removeSubprotocol(protocolIndexParam, subprotocolIndexParam) {
    const protocol = protocols[protocolIndexParam];
    if (!protocol) throw new Error(`Protocol not found, index: ${protocolIndexParam}`);

    const subprotocol = protocol.subprotocols[subprotocolIndexParam];
    if (!subprotocol) throw new Error(`Subprotocol not found, index: ${subprotocolIndexParam}`);

    if (typeof subprotocol.id === 'number') {
      const response = await Api.delete(`/protocols/${protocol.id}/subprotocols/${subprotocol.id}`);
      if (!response.ok) return Alert.error(response.message);

      setProtocols(prevState =>
        prevState.map((protocol, protocolIndex) => {
          if (protocolIndex !== protocolIndexParam) return protocol;

          return {
            ...protocol,
            subprotocols: protocol.subprotocols.filter(
              (_, subprotocolIndex) => subprotocolIndex != subprotocolIndexParam,
            ),
          };
        }),
      );
    } else {
      setProtocols(prevState =>
        prevState.map((protocol, protocolIndex) => {
          if (protocolIndex !== protocolIndexParam) return protocol;

          return {
            ...protocol,
            subprotocols: protocol.subprotocols.filter(
              (_, subprotocolIndex) => subprotocolIndex != subprotocolIndexParam,
            ),
          };
        }),
      );
    }
  }

  function changePropValue(protocolIndexParam, prop, value, subprotocolIndexParam = null) {
    setProtocols(prevState =>
      prevState.map((protocol, protocolIndex) => {
        if (protocolIndex !== protocolIndexParam) return protocol;

        if (subprotocolIndexParam !== null) {
          return {
            ...protocol,
            subprotocols: protocol.subprotocols.map((subprotocol, subprotocolIndex) => {
              if (subprotocolIndex !== subprotocolIndexParam) return subprotocol;

              return {
                ...subprotocol,
                [prop]: value,
              };
            }),
          };
        }

        return {
          ...protocol,
          [prop]: value,
        };
      }),
    );
  }

  async function loadClients() {
    if (authUser.isHealthTeam()) {
      if (attendance) {
        setClientes([attendance.campus.client]);
      } else {
        setClientes([]);
        console.error('No hay campus en la asistencia (localstorage)');
      }
    } else {
      const response = await Api.get('/dropdown-options/clients', { limit: 1000 });
      if (!response.ok) return Alert.error(response.message);
      setClientes(response.data);
    }
  }

  async function loadProtocols(protocol_type_id) {
    if (protocol_type_id == ProtocolType.SANNA_ID) {
      setClientes([]);
    }

    const queryData = {
      query: query,
      limit: 1000,
      order_col: 'protocols.title',
      order_dir: 'ASC',
      protocol_type_id,
    };

    if (authUser.isHealthTeam() && protocol_type_id == ProtocolType.CLIENT_ID) {
      queryData.client_id = authUser.getAllClientsFromAssigments().map(client => client.id);
    }

    const response = await Api.get('/protocols', queryData);
    if (!response.ok) return Alert.error(response.message);

    if (query && !response.data.length) {
      setNoResultData({ query, status: NO_RESULT_STATUS.SHOWING });
    }
    setProtocols(response.data);
  }

  async function loadData() {
    setLoading(true);
    if (protocolTypeId == ProtocolType.CLIENT_ID) {
      await loadClients();
      await loadProtocols(ProtocolType.CLIENT_ID);
    } else {
      await loadProtocols(ProtocolType.SANNA_ID);
    }
    setLoading(false);
  }

  return (
    <PageWrapper>
      <Typography
        variant="h6"
        className="mb-16 text-24"
      >
        <Icon className="leading-normal material-icons-outlined mr-8">auto_stories</Icon>
        <span>Protocolos</span>
      </Typography>

      <div className="flex justify-between mb-20">
        <div className="inline-flex gap-16 items-center p-6 bg-white rounded-full">
          {protocolTypeId === ProtocolType.SANNA_ID ? (
            <>
              <Button color="secondary">Protocolos de SANNA</Button>
              <div
                className={clsx(classes.buttonTabEmpty, loading && 'pointer-events-none')}
                onClick={() => setProtocolTypeId(ProtocolType.CLIENT_ID)}
              >
                Protocolos de cliente
              </div>
            </>
          ) : (
            <>
              <div
                className={clsx(classes.buttonTabEmpty, loading && 'pointer-events-none')}
                onClick={() => setProtocolTypeId(ProtocolType.SANNA_ID)}
              >
                Protocolos de SANNA
              </div>
              <Button color="secondary">Protocolos de cliente</Button>
            </>
          )}
        </div>

        <Paper
          component="form"
          className={classes.searcherPaper}
        >
          <InputBase
            onKeyDown={e => {
              if (e.key === 'Enter') e.preventDefault();
            }}
            className={classes.searcherInput}
            placeholder="Buscar un termino"
            inputProps={{ 'aria-label': 'searcher' }}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <IconButton
            onClick={() => {
              setNoResultData({
                query: '',
                status: NO_RESULT_STATUS.INIT,
              });
              loadData();
            }}
            aria-label="search"
            className="text-muiprimary"
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      </div>

      {loading && (
        <AccordionProtocolStekeleton
          grouped={protocolTypeId === ProtocolType.CLIENT_ID}
          countRows={4}
          countGroups={protocolTypeId === ProtocolType.CLIENT_ID ? 2 : 1}
        />
      )}

      {noResultData.status === NO_RESULT_STATUS.SHOWING && !loading && (
        <div
          className="text-center"
          style={{ paddingTop: '100px' }}
        >
          <div className="text-muisecondary mb-24">
            <Icon style={{ fontSize: 32 }}>help_outline</Icon>
          </div>
          <Typography
            variant="h6"
            className="font-semibold"
          >
            No hemos encontrado <br /> resultados para:
          </Typography>
          <Typography className="mb-20">{noResultData.query}</Typography>
          <Button
            onClick={() => {
              setNoResultData(prevState => ({
                ...prevState,
                status: NO_RESULT_STATUS.HIDING,
              }));
              setQuery('');
            }}
            style={{ paddingLeft: 60, paddingRight: 60 }}
          >
            Limpiar búsqueda
          </Button>
        </div>
      )}

      {noResultData.status === NO_RESULT_STATUS.INIT && !loading && protocolTypeId === ProtocolType.CLIENT_ID && (
        <div className="flex flex-col gap-16">
          {clients.map((client, index) => (
            <div
              key={index}
              className="p-12 shadow rounded-8"
            >
              <div className="mb-20">
                <Typography
                  variant="h6"
                  className="text-16 mb-12"
                >
                  {client.name}
                </Typography>

                {protocols.map((protocol, protocolIndex) => {
                  if (protocol.client_id !== client.id) return null;

                  return (
                    <div
                      key={protocolIndex}
                      className="mb-12"
                    >
                      <AccordionProtocol
                        readOnly={authUser.isHealthTeam() || authUser.isClient()}
                        menuActions={{
                          onSave: () => saveProtocol(protocolIndex),
                          onDelete: () => Alert.confirm(() => removeProtocol(protocolIndex)),
                          onEdit: () => changePropValue(protocolIndex, 'editing', true),
                        }}
                        onUploadedFile={filedata => addProtocolFile(protocolIndex, filedata)}
                        expanded={protocol.expanded || false}
                        onExpand={async () => {
                          changePropValue(protocolIndex, 'expanded', !protocol.expanded);

                          if (!protocol.expanded && !protocol.subprotocols?.length && !protocol.creating) {
                            changePropValue(protocolIndex, 'loadingSubprotocols', true);
                            const response = await Api.get(`/protocols/${protocol.id}/subprotocols`);
                            changePropValue(protocolIndex, 'loadingSubprotocols', false);
                            if (!response.ok) return Alert.error(response.message);
                            changePropValue(protocolIndex, 'subprotocols', response.data);
                          }
                        }}
                        loadingSubprotocols={protocol.loadingSubprotocols || false}
                        editing={protocol.editing || false}
                        creating={protocol.creating || false}
                        title={protocol.title}
                        onChangeTitle={e => changePropValue(protocolIndex, 'title', e.target.value)}
                        description={protocol.description}
                        onChangeDescription={e => changePropValue(protocolIndex, 'description', e.target.value)}
                        onAddSubprotocol={() => addSubProtocol(protocolIndex)}
                        files={protocol.protocol_files.map(protocol_file => ({
                          id: protocol_file.file.id,
                          name: protocol_file.file.name,
                          onSee: () => history.push(`/file-viewer/${protocol_file.file.id}`),
                          onDelete: () => Alert.confirm(() => removeProtocolFile(protocolIndex, protocol_file.id)),
                          onDownload: () => Api.download(`/files/${protocol_file.file.id}/download`),
                        }))}
                        subprotocols={(protocol.subprotocols || []).map((subprotocol, subprotocolIndex) => (
                          <AccordionProtocol
                            readOnly={authUser.isHealthTeam() || authUser.isClient()}
                            key={subprotocolIndex}
                            amSubProtocol
                            menuActions={{
                              onSave: () => saveSubprotocol(protocolIndex, subprotocolIndex),
                              onDelete: () => Alert.confirm(() => removeSubprotocol(protocolIndex, subprotocolIndex)),
                              onEdit: () => changePropValue(protocolIndex, 'editing', true, subprotocolIndex),
                            }}
                            onUploadedFile={filedata => addSubprotocolFile(protocolIndex, subprotocolIndex, filedata)}
                            expanded={subprotocol.expanded || false}
                            onExpand={() =>
                              changePropValue(protocolIndex, 'expanded', !subprotocol.expanded, subprotocolIndex)
                            }
                            editing={subprotocol.editing || false}
                            creating={subprotocol.creating || false}
                            title={subprotocol.title}
                            onChangeTitle={e =>
                              changePropValue(protocolIndex, 'title', e.target.value, subprotocolIndex)
                            }
                            description={subprotocol.description}
                            onChangeDescription={e =>
                              changePropValue(protocolIndex, 'description', e.target.value, subprotocolIndex)
                            }
                            files={subprotocol.subprotocol_files.map(protocol_file => ({
                              id: protocol_file.file.id,
                              name: protocol_file.file.name,
                              onSee: () => history.push(`/file-viewer/${protocol_file.file.id}`),
                              onDelete: () =>
                                Alert.confirm(() =>
                                  removeSubprotocolFile(protocolIndex, subprotocolIndex, protocol_file.id),
                                ),
                              onDownload: () => Api.download(`/files/${protocol_file.file.id}/download`),
                            }))}
                          />
                        ))}
                      />
                    </div>
                  );
                })}
              </div>

              {!authUser.isHealthTeam() && !authUser.isClient() && (
                <div className="flex justify-end gap-8">
                  <Button
                    onClick={() => addProtocol(ProtocolType.CLIENT_ID, client.id)}
                    aria-label="add protocol"
                    startIcon={<AddIcon />}
                  >
                    Añadir nuevo protocolo
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {noResultData.status === NO_RESULT_STATUS.INIT && !loading && protocolTypeId === ProtocolType.SANNA_ID && (
        <div>
          {protocols.map((protocol, protocolIndex) => {
            return (
              <div
                key={protocolIndex}
                className="mb-12"
              >
                <AccordionProtocol
                  readOnly={authUser.isHealthTeam() || authUser.isClient()}
                  menuActions={{
                    onSave: () => saveProtocol(protocolIndex),
                    onDelete: () => Alert.confirm(() => removeProtocol(protocolIndex)),
                    onEdit: () => changePropValue(protocolIndex, 'editing', true),
                  }}
                  onUploadedFile={filedata => addProtocolFile(protocolIndex, filedata)}
                  expanded={protocol.expanded || false}
                  onExpand={async () => {
                    changePropValue(protocolIndex, 'expanded', !protocol.expanded);

                    if (!protocol.expanded && !protocol.subprotocols?.length && !protocol.creating) {
                      changePropValue(protocolIndex, 'loadingSubprotocols', true);
                      const response = await Api.get(`/protocols/${protocol.id}/subprotocols`);
                      changePropValue(protocolIndex, 'loadingSubprotocols', false);
                      if (!response.ok) return Alert.error(response.message);
                      changePropValue(protocolIndex, 'subprotocols', response.data);
                    }
                  }}
                  loadingSubprotocols={protocol.loadingSubprotocols || false}
                  editing={protocol.editing || false}
                  creating={protocol.creating || false}
                  title={protocol.title}
                  onChangeTitle={e => changePropValue(protocolIndex, 'title', e.target.value)}
                  description={protocol.description}
                  onChangeDescription={e => changePropValue(protocolIndex, 'description', e.target.value)}
                  files={protocol.protocol_files.map(protocol_file => ({
                    id: protocol_file.file.id,
                    name: protocol_file.file.name,
                    onSee: () => history.push(`/file-viewer/${protocol_file.file.id}`),
                    onDelete: () => Alert.confirm(() => removeProtocolFile(protocolIndex, protocol_file.id)),
                    onDownload: () => Api.download(`/files/${protocol_file.file.id}/download`),
                  }))}
                  onAddSubprotocol={() => addSubProtocol(protocolIndex)}
                  subprotocols={(protocol.subprotocols || []).map((subprotocol, subprotocolIndex) => (
                    <AccordionProtocol
                      readOnly={authUser.isHealthTeam() || authUser.isClient()}
                      key={subprotocolIndex}
                      amSubProtocol
                      menuActions={{
                        onSave: () => saveSubprotocol(protocolIndex, subprotocolIndex),
                        onDelete: () => Alert.confirm(() => removeSubprotocol(protocolIndex, subprotocolIndex)),
                        onEdit: () => changePropValue(protocolIndex, 'editing', true, subprotocolIndex),
                      }}
                      onUploadedFile={filedata => addSubprotocolFile(protocolIndex, subprotocolIndex, filedata)}
                      expanded={subprotocol.expanded || false}
                      onExpand={() =>
                        changePropValue(protocolIndex, 'expanded', !subprotocol.expanded, subprotocolIndex)
                      }
                      editing={subprotocol.editing || false}
                      creating={subprotocol.creating || false}
                      title={subprotocol.title}
                      onChangeTitle={e => changePropValue(protocolIndex, 'title', e.target.value, subprotocolIndex)}
                      description={subprotocol.description}
                      onChangeDescription={e =>
                        changePropValue(protocolIndex, 'description', e.target.value, subprotocolIndex)
                      }
                      files={subprotocol.subprotocol_files.map(protocol_file => ({
                        id: protocol_file.file.id,
                        name: protocol_file.file.name,
                        onSee: () => history.push(`/file-viewer/${protocol_file.file.id}`),
                        onDelete: () =>
                          Alert.confirm(() => removeSubprotocolFile(protocolIndex, subprotocolIndex, protocol_file.id)),
                        onDownload: () => Api.download(`/files/${protocol_file.file.id}/download`),
                      }))}
                    />
                  ))}
                />
              </div>
            );
          })}

          {noResultData.status !== NO_RESULT_STATUS.SHOWING && !authUser.isHealthTeam() && !authUser.isClient() && (
            <div className="flex justify-end gap-8">
              <Button
                onClick={() => addProtocol(ProtocolType.SANNA_ID)}
                aria-label="add protocol"
                startIcon={<AddIcon />}
              >
                Añadir nuevo protocolo
              </Button>
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
}

export default Protocols;
