<template>
  <div>
    <CCard class="mb-4">
      <CCardHeader>
        <strong>Dashboard</strong>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol sm="6" lg="3">
            <CWidgetStatsF
              color="primary"
              title="Benutzer"
              value="1,123"
              icon="cil-user"
            />
          </CCol>
          <CCol sm="6" lg="3">
            <CWidgetStatsF
              color="info"
              title="Aktive Plugins"
              value="87"
              icon="cil-puzzle"
            />
          </CCol>
          <CCol sm="6" lg="3">
            <CWidgetStatsF
              color="warning"
              title="Webhooks"
              value="5"
              icon="cil-link"
            />
          </CCol>
          <CCol sm="6" lg="3">
            <CWidgetStatsF
              color="danger"
              title="System-Status"
              value="Online"
              icon="cil-check-circle"
            />
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>

    <CRow>
      <CCol md="6">
        <CCard class="mb-4">
          <CCardHeader>
            <strong>Letzte Aktivitäten</strong>
          </CCardHeader>
          <CCardBody>
            <CListGroup flush>
              <CListGroupItem>
                <div class="d-flex w-100 justify-content-between">
                  <h6 class="mb-1">Neuer Benutzer registriert</h6>
                  <small class="text-medium-emphasis">3 min</small>
                </div>
                <p class="mb-1">Max Mustermann wurde als Administrator hinzugefügt.</p>
              </CListGroupItem>
              <CListGroupItem>
                <div class="d-flex w-100 justify-content-between">
                  <h6 class="mb-1">Plugin aktualisiert</h6>
                  <small class="text-medium-emphasis">1 Stunde</small>
                </div>
                <p class="mb-1">CRM-Plugin wurde auf Version 2.1.0 aktualisiert.</p>
              </CListGroupItem>
              <CListGroupItem>
                <div class="d-flex w-100 justify-content-between">
                  <h6 class="mb-1">Webhook ausgelöst</h6>
                  <small class="text-medium-emphasis">2 Stunden</small>
                </div>
                <p class="mb-1">Neue Bestellung über Webhook empfangen.</p>
              </CListGroupItem>
            </CListGroup>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol md="6">
        <CCard class="mb-4">
          <CCardHeader>
            <strong>System-Informationen</strong>
          </CCardHeader>
          <CCardBody>
            <CListGroup flush>
              <CListGroupItem>
                <div class="d-flex w-100 justify-content-between">
                  <strong>Version:</strong>
                  <span>1.0.0-alpha</span>
                </div>
              </CListGroupItem>
              <CListGroupItem>
                <div class="d-flex w-100 justify-content-between">
                  <strong>PHP Version:</strong>
                  <span>8.3.0</span>
                </div>
              </CListGroupItem>
              <CListGroupItem>
                <div class="d-flex w-100 justify-content-between">
                  <strong>Symfony Version:</strong>
                  <span>7.3.0</span>
                </div>
              </CListGroupItem>
              <CListGroupItem>
                <div class="d-flex w-100 justify-content-between">
                  <strong>Datenbank:</strong>
                  <span>MySQL 8.0</span>
                </div>
              </CListGroupItem>
            </CListGroup>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script setup>
// Dashboard-Logik hier
</script> 