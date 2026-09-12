package it.uniroma3.siw.model;

import java.time.Duration;

import java.util.List;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;


@Entity
public class Brano {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	@NotBlank
	private String nome;
	private int anno;
	private String genere;
	private Duration durata;
	private String imgUrl;
	@JsonIgnoreProperties({"albumIncisi", "braniIncisi", "braniOspite"})
	@ManyToOne
	private Artista autore;
	@JsonIgnoreProperties("braniOspite")
	@ManyToMany
	private List<Artista> featuring;
	@JsonIgnoreProperties("brani")
	@ManyToOne
	private Album album;
	@ManyToMany(mappedBy="brani")
	private List<Playlist> playlists;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public int getAnno() {
		return anno;
	}
	public void setAnno(int anno) {
		this.anno = anno;
	}
	public String getGenere() {
		return genere;
	}
	public void setGenere(String genere) {
		this.genere = genere;
	}
	public Long getMinuti() {
        if (this.durata == null) return 0L;
        return this.durata.toMinutes(); 
    }
	public void setMinuti(Long minuti) {
        if (minuti == null) minuti = 0L;
        long secondiAttuali = (this.durata != null) ? this.durata.toSecondsPart() : 0;
        this.durata = Duration.ofMinutes(minuti).plusSeconds(secondiAttuali);
    }
	public Integer getSecondi() {
        if (this.durata == null) return 0;
        return this.durata.toSecondsPart(); 
    }

    public void setSecondi(Integer secondi) {
        if (secondi == null) secondi = 0;
        long minutiAttuali = (this.durata != null) ? this.durata.toMinutes() : 0L;
        this.durata = Duration.ofMinutes(minutiAttuali).plusSeconds(secondi);
    }
	public String getImgUrl() {
		return imgUrl;
	}
	public void setImgUrl(String imgUrl) {
		this.imgUrl = imgUrl;
	}
	
	
	public Artista getAutore() {
		return autore;
	}
	public void setAutore(Artista autore) {
		this.autore = autore;
	}
	public List<Artista> getFeaturing() {
		return featuring;
	}
	public void setFeaturing(List<Artista> featuring) {
		this.featuring = featuring;
	}
	public Album getAlbum() {
		return album;
	}
	public void setAlbum(Album album) {
		this.album = album;
	}
	public List<Playlist> getPlaylists() {
		return playlists;
	}
	public void setPlaylists(List<Playlist> playlists) {
		this.playlists = playlists;
	}
	@Override
	public int hashCode() {
		return Objects.hash(anno, nome);
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Brano other = (Brano) obj;
		return anno == other.anno && Objects.equals(nome, other.nome);
	}
	
	
}
