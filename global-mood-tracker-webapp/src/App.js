<div style={{ textAlign: "center", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "5px" }}>📊</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333" }}>{responses.length}</div>
                  <div style={{ color: "#666" }}>Total Responses</div>
                </div>
                {/* This next div was causing the issue because it was outside the closing </div> of the stats grid,
                   and then you had an extra closing </div> after it, and an incomplete div tag */}
                <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "5px" }}>⭐</div> {/* Example emoji */}
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333" }}>
                    {responses.length > 0 && getWellbeingData(getContinentStats().find(c => c.total > 0)?.dominantState || 'Balanced')?.emoji}
                    {' '}
                    {responses.length > 0 && getContinentStats().find(c => c.total > 0)?.dominantState || 'No Data'}
                  </div>
                  <div style={{ color: "#666" }}>Top Global Feeling</div>
                </div>
              </div>
            )}
          </div>
        ) } {/* This closes the conditional rendering for currentView === "map" */}
      </div> {/* This closes the div with maxWidth: "1200px" */}
    </div> // This closes the main div with minHeight: "100vh"
  );
}
