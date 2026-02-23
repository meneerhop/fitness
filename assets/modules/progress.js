
export function renderProgressChart(ctx, labels, values){
  new Chart(ctx,{
    type:'line',
    data:{labels,datasets:[{label:'Progress',data:values,borderColor:'#fff'}]}
  });
}
